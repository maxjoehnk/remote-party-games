import { Module } from '@nestjs/common';
import { SocketGateway } from './sockets/socket-gateway';
import { MetricsController } from './controllers/metrics-controller';
import { SocketMetrics } from './metrics/socket';
import { SocketBroadcaster } from './sockets/socket-broadcaster';
import { MessageQueue } from './message-queue/message-queue';
import { BroadcastSubscriber } from './broadcast-subscriber';

@Module({
  controllers: [MetricsController],
  providers: [
    MessageQueue,
    SocketGateway,
    {
      provide: SocketBroadcaster,
      useExisting: SocketGateway,
    },
    SocketMetrics,
    BroadcastSubscriber,
  ],
})
export class AppModule {}
