import * as WebSocket from 'ws';

export interface SocketBroadcaster {
  broadcast(
    msg: any,
    clientFilter: (ws: WebSocket, playerId: string) => boolean
  );
}
