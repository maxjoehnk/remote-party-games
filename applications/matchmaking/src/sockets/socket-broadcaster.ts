import * as WebSocket from 'ws';

export type SocketMessage = {
  type: string;
} & any;

export interface SocketBroadcaster {
  broadcast(
    msg: SocketMessage,
    clientFilter?: (ws: WebSocket, playerId: string) => boolean
  );
}
