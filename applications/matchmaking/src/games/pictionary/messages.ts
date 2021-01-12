import { Action } from '../game-handler';

export enum PictionaryActionTypes {
  Timer = 'pictionary/timer',
  SelectWord = 'pictionary/select-word',
  Draw = 'pictionary/draw',
  Guess = 'pictionary/guess',
  NextRound = 'pictionary/continue',
}

export interface DrawAction extends Action<PictionaryActionTypes.Draw> {
  actions: any[];
}

export interface SelectWord extends Action<PictionaryActionTypes.SelectWord> {
  word: string;
}

export interface GuessWord extends Action<PictionaryActionTypes.Guess> {
  message: string;
}

export enum PictionaryEventTypes {
  Chat = 'pictionary/chat',
  Update = 'pictionary/update',
  GuessedRight = 'pictionary/guessed-right',
  Scores = 'pictionary/scores',
  ImageUpdate = 'pictionary/image-update',
}
