import { Player } from '../contracts/player';

export interface PlayerAccessor {
  getPlayers(): Promise<Player[]>;
}
