import { GameScore } from './game-history';

export interface Game {
  type: string;
  state: object;

  start(): Promise<void>;
  stop(): Promise<GameScore>;
  execute(action: any, playerId?: string): Promise<void>;
}
