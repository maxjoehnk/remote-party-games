import { WsAdapter } from '@nestjs/platform-ws';
import { MessageMappingProperties } from '@nestjs/websockets';
import { EMPTY, Observable } from 'rxjs';

export class CustomWsAdapter extends WsAdapter {
  bindMessageHandler(
    buffer: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>
  ): Observable<any> {
    try {
      const message = JSON.parse(buffer.data);
      console.log('[Socket] Received message', message);
      const messageHandler = handlers.find(
        (handler) => handler.message === message.type
      );
      if (!messageHandler) {
        console.warn('[Socket] No handler for message', message.type);
      }

      const { callback } = messageHandler;

      return transform(callback(message));
    } catch (err) {
      return EMPTY;
    }
  }
}
