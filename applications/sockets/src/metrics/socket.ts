import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Gauge, register } from 'prom-client';

@Injectable()
export class SocketMetrics {
  openSocketGauge = new Gauge({
    name: 'websocket_open_connections',
    help: 'Count of open socket connections',
  });

  socketRecvMessageCounter = new Counter({
    name: 'websocket_received_messages',
    help: 'Count of received socket messages',
  });

  socketSentMessageCounter = new Counter({
    name: 'websocket_sent_messages',
    help: 'Count of sent socket messages',
  });

  constructor() {
    collectDefaultMetrics();
  }

  getMetrics() {
    return register.metrics();
  }
}
