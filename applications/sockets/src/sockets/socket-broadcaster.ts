export type SocketMessage = {
  type: string;
  message?: unknown;
};

export abstract class SocketBroadcaster {
  abstract broadcast(msg: SocketMessage, players?: string[]): void;
}
