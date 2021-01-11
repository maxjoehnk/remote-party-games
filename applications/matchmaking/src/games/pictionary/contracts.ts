export interface RoundState {
  timeLeft?: number;
  drawingActions?: any[];
  drawingPlayer: string;
  letters?: string[];
  rankings?: PlayerRanking[];
  word?: string;
  view: PictionaryView;
  wordsToChooseFrom?: string[];
}

export interface PlayerRanking {
  player: string;
  points: number;
}

export enum PictionaryView {
  Idle = 0,
  Drawing = 1,
  WordSelection = 2,
  Guessing = 3,
  Scores = 4,
}

export enum GamePhase {
  SelectingWord = 0,
  Running = 1,
  Scores = 2,
}

export interface PictionaryGameState {
  phase: GamePhase;
  currentPlayer: string;
  currentWord: string;
  currentDrawing: any[];
  visibleLetters: number[];
  timeLeft: number;
  answers: string[];
  availableWords: string[];
  rankings: PlayerRanking[];
}
