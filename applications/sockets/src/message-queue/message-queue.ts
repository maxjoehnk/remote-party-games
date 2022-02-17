import { Channel, connect, Connection, Replies } from 'amqplib';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { SocketMessage } from '../sockets/socket-broadcaster';
import { tracer } from '../tracing';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import AssertQueue = Replies.AssertQueue;
import AssertExchange = Replies.AssertExchange;

const broadcastSuffix = randomBytes(4).toString('hex');

const sendExchange = 'socket-messages';
const receiveQueue = `socket-broadcasts-${broadcastSuffix}`;
const receiveExchange = 'socket-broadcasts';

export interface SocketBroadcastEvent {
  type: string;
  message: SocketMessage;
  correlationId: string;
  userIds?: string[];
}

export interface SocketMessageEnvelope {
  type: string;
  message?: SocketMessage;
  correlationId: string;
  userId: string;
}

@Injectable()
export class MessageQueue {
  setup: Promise<void>;
  connection: Connection;
  channel: Channel;

  sendExchange: AssertExchange;
  receiveQueue: AssertQueue;
  receiveExchange: AssertExchange;

  constructor() {
    this.setup = connect(process.env.BROKER_URL || 'amqp://localhost:5672')
      .then(conn => (this.connection = conn))
      .then(() => this.connection.createChannel())
      .then(chan => (this.channel = chan))
      .then(async () => {
        this.sendExchange = await this.channel.assertExchange(sendExchange, 'topic', {
          durable: true,
        });
        this.receiveQueue = await this.channel.assertQueue(receiveQueue, { autoDelete: true });
        this.receiveExchange = await this.channel.assertExchange(receiveExchange, 'fanout');
        await this.channel.bindQueue(receiveQueue, receiveExchange, '*');
      });
  }

  send(message: SocketMessageEnvelope) {
    this.channel.publish(
      this.sendExchange.exchange,
      message.type,
      Buffer.from(JSON.stringify(message)),
      {
        contentType: 'application/json',
        correlationId: message.correlationId,
      }
    );
  }

  async subscribe(callback: (msg: SocketBroadcastEvent) => Promise<void> | void): Promise<void> {
    await this.setup;
    await this.channel.consume(receiveQueue, async message => {
      const event: SocketBroadcastEvent = JSON.parse(message.content.toString('utf8'));
      event.correlationId = message.properties.correlationId;
      const span = tracer.startSpan('handleMessage', {
        attributes: {
          [SemanticAttributes.MESSAGE_TYPE]: event.type,
        },
        kind: SpanKind.CONSUMER,
      });
      try {
        await callback(event);
        await this.channel.ack(message);
        span.setStatus({ code: SpanStatusCode.OK });
      } catch (err) {
        await this.channel.nack(message);
        span.setStatus({ code: SpanStatusCode.ERROR, message: JSON.stringify(err) });
      }
      span.end();
    });
  }
}
