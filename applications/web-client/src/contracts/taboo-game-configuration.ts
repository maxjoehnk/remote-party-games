import { TabooCardModel } from './taboo-card';

export interface TabooGameConfiguration {
  timer: number;
}

export interface TabooGameState {
  teamOne: TabooTeamState;
  teamTwo: TabooTeamState;
  currentRound?: TabooCurrentRoundState;
  currentCard: TabooCardModel | null;
  cards?: PastCardState[];
  view: TabooView;
}

export interface TabooCurrentRoundState {
  team: 1 | 2;
  activePlayer: string;
  timeLeft: number;
}

export enum TabooView {
  Explaining = 0,
  Guessing = 1,
  Observing = 2,
  Continue = 3,
  Waiting = 4,
}

export interface TabooTeamState {
  players: string[];
  points: number;
}

export interface PastCardState {
  card: TabooCardModel;
  answer: PastCardAnswer;
}

export enum PastCardAnswer {
  Guessed,
  Skipped,
  TimedOut,
}
