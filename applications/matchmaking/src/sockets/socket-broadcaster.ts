export type SocketMessage = {
  type: string;
} & any;

export abstract class SocketBroadcaster {
  abstract broadcast(msg: SocketMessage, players?: string[]);
}
