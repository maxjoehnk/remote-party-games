import { EventBus } from '@nestjs/cqrs';
import { Counter } from 'prom-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventBusMetrics {
  private busMessageCounter = new Counter({
    name: 'bus_sent_messages',
    help: 'Count of sent event bus messages',
  });

  constructor(private eventBus: EventBus) {
    this.eventBus.subscribe(() => this.busMessageCounter.inc());
  }
}
