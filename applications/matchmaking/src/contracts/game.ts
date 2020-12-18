import { GameScore } from './game-history';

export interface Game {
  type: string;
  state: object;

  start(): Promise<void>;
  stop(): Promise<GameScore>;
  execute(action: any): Promise<void>;
}
