import { Player } from './player';
import { Team } from './team';
import { GameHistory } from './game-history';

export interface Lobby {
  code: string;
  players: Player[];
  game: string;
  teams: Team[];
  history: GameHistory[]
}
