import { PlayerModel } from './player.model';
import { TeamModel } from './team.model';

export interface GameHistoryModel {
  game: string;
  score: ScoreModel;
  players: PlayerModel[];
}

export interface ScoreModel {
  winner: string;
  scores: { [key: string]: number };
  type: 'team-score' | 'player-score';
  teams?: TeamModel[];
}
