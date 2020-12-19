import { Player } from './player';
import { Team } from './team';
import { GameHistory } from './game-history';
import { GameTypes } from '../games/types';
import { GameConfiguration } from '../games/config';

export interface Lobby {
  code: string;
  players: Player[];
  game: GameTypes;
  teams: Team[];
  history: GameHistory[];
  gameConfiguration: GameConfiguration;
}
