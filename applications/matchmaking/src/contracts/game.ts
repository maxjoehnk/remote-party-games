export interface Game {
  type: string;
  state: object;

  start(): Promise<void>;
  stop(): Promise<void>;
  execute(action: any): Promise<void>;
}
