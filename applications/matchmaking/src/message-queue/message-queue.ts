import { Channel, connect, Connection, Replies } from 'amqplib';
import AssertQueue = Replies.AssertQueue;
import { Injectable } from '@nestjs/common';
import AssertExchange = Replies.AssertExchange;
import { randomBytes } from 'crypto';
import { SocketBroadcaster, SocketMessage } from '../sockets/socket-broadcaster';

const sendExchange = 'socket-broadcasts';
const receiveExchange = 'socket-messages';

export interface SocketMessageEvent<TMessage> {
  type: string;
  message: TMessage;
  userId: string;
}

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
export class MessageQueue implements SocketBroadcaster {
  setup: Promise<void>;
  connection: Connection;
  channel: Channel;

  sendExchange: AssertExchange;
  receiveExchange: AssertExchange;

  constructor() {
    this.setup = connect(process.env.BROKER_URL || 'amqp://localhost:5672')
      .then(conn => (this.connection = conn))
      .then(() => this.connection.createChannel())
      .then(chan => (this.channel = chan))
      .then(async () => {
        this.sendExchange = await this.channel.assertExchange(sendExchange, 'fanout');
        this.receiveExchange = await this.channel.assertExchange(receiveExchange, 'topic');
      });
  }

  private send(message: SocketBroadcastEvent) {
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

  async subscribe<TMessage>(
    type: string,
    callback: (msg: SocketMessageEvent<TMessage>) => Promise<void> | void
  ): Promise<void> {
    await this.setup;
    const queueName = `matchmaking-${type}`;
    await this.channel.assertQueue(queueName);
    await this.channel.bindQueue(queueName, receiveExchange, type);
    await this.channel.consume(queueName, async msg => {
      try {
        const message: SocketMessageEnvelope = JSON.parse(msg.content.toString('utf8'));
        const event: SocketMessageEvent<TMessage> = {
          type,
          message: message.message,
          userId: message.userId,
        };
        await callback(event);
        await this.channel.ack(msg);
      } catch (err) {
        await this.channel.nack(msg);
      }
    });
  }

  broadcast(msg: SocketMessage, players?: string[]) {
    this.send({
      type: msg.type,
      message: msg,
      correlationId: '',
      userIds: players,
    });
  }
}
