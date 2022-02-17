import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { SocketBroadcaster, SocketMessage } from './socket-broadcaster';
import { SocketMetrics } from '../metrics/socket';
import Timeout = NodeJS.Timeout;
import { parse } from 'url';
import { MessageQueue, SocketMessageEnvelope } from '../message-queue/message-queue';
import { socketConnected, socketDisconnected } from './socket-messages';
import { v4 as uuid } from 'uuid';

const SECOND = 1000;
const KEEP_ALIVE = 30 * SECOND;

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket>, SocketBroadcaster {
  private sockets = new WeakMap<WebSocket, string>();
  private socketKeepAlives = new WeakMap<WebSocket, Timeout>();

  @WebSocketServer()
  server: WebSocket.Server;

  constructor(private socketMetrics: SocketMetrics, private messageQueue: MessageQueue) {}

  handleConnection(client: WebSocket, msg: any) {
    const url = parse(msg.url, true);
    if (url.query.userId == null) {
      console.warn(`[Socket] Connection opened without user id`);
      return client.close();
    }
    const playerId = url.query.userId as string;

    console.log(`[Socket] Player ${playerId} joined`);

    this.sockets.set(client, playerId);
    this.socketMetrics.openSocketGauge.inc();
    client.addEventListener('message', () => this.socketMetrics.socketRecvMessageCounter.inc());
    client.addEventListener('message', event => {
      const message: SocketMessage = JSON.parse(event.data);
      const eventEnvelope: SocketMessageEnvelope = {
        type: message.type,
        correlationId: uuid(),
        userId: playerId,
        message,
      };
      this.messageQueue.send(eventEnvelope);
    });
    const keepAlive = setInterval(() => {
      client.send(JSON.stringify({ type: 'keep-alive' }));
    }, KEEP_ALIVE);
    this.socketKeepAlives.set(client, keepAlive);
    this.messageQueue.send({
      type: socketConnected,
      correlationId: uuid(),
      userId: playerId,
      message: {
        type: socketConnected,
      },
    });
  }

  handleDisconnect(client: WebSocket) {
    const playerId = this.getPlayerId(client);
    this.sockets.delete(client);
    this.socketMetrics.openSocketGauge.dec();
    const keepAlive = this.socketKeepAlives.get(client);
    clearInterval(keepAlive);
    this.socketKeepAlives.delete(client);
    this.messageQueue.send({
      type: socketDisconnected,
      correlationId: uuid(),
      userId: playerId,
      message: {
        type: socketDisconnected,
      },
    });
  }

  broadcast(msg: any, playerIds: string[] = null) {
    this.server.clients.forEach(ws => {
      const playerId = this.sockets.get(ws);
      if (playerIds != null && !playerIds.includes(playerId)) {
        return;
      }
      this.sendMessage(ws, msg);
    });
  }

  private sendMessage(ws: WebSocket, msg: any) {
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.send(JSON.stringify(msg));
    this.socketMetrics.socketSentMessageCounter.inc();
  }

  private getPlayerId(client: WebSocket): string {
    return this.sockets.get(client);
  }
}
