import { Player } from './player';
import { Team } from './team';

export interface Lobby {
  code: string;
  players: Player[];
  game: string;
  teams: Team[];
}
