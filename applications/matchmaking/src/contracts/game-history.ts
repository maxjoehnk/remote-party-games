import { Team } from './team';
import { Player } from './player';

export interface GameScore {
  winner: string;
  scores: { [key: string]: number };
}

export interface TeamBasedScore extends GameScore {
  type: 'team-score';
  teams: Team[];
}

export interface PlayerBasedScore extends GameScore {
  type: 'player-score';
}

export interface GameHistory {
  game: string;
  score: GameScore;
  players: Player[];
}
