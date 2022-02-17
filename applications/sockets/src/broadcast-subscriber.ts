import { MessageQueue } from './message-queue/message-queue';
import { SocketBroadcaster } from './sockets/socket-broadcaster';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class BroadcastSubscriber implements OnModuleInit {
  constructor(private messageQueue: MessageQueue, private socketBroadcaster: SocketBroadcaster) {}

  onModuleInit(): any {
    return this.messageQueue.subscribe(({ userIds, ...msg }) =>
      this.socketBroadcaster.broadcast(msg.message, userIds)
    );
  }
}
