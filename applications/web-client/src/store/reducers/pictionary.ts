import { createReducer } from '@reduxjs/toolkit';
import { gameStopped } from '../actions/game';
import { DrawingAction } from '../../app/game-widgets/drawing/drawing-context';
import { pictionaryChat, pictionaryGameUpdate, pictionaryRightGuess } from '../actions/pictionary';
import i18n from 'es2015-i18n-tag';

export interface PictionaryState {
  currentRound?: PictionaryRoundState;
  chat: ChatMessage[];
}

export interface ChatMessage {
  player: string;
  message: string;
  system?: SystemMessage;
}

export enum SystemMessage {
  GuessedRight,
}

export interface PictionaryRoundState {
  timeLeft?: number;
  drawingActions?: DrawingAction[];
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

const initialState: PictionaryState = {
  currentRound: null,
  chat: [],
};

export const pictionaryReducer = createReducer<PictionaryState>(initialState, builder =>
  builder
    .addCase(pictionaryGameUpdate, (state, action) => ({
      ...state,
      currentRound: action.payload,
    }))
    .addCase(pictionaryChat, (state, action) => ({
      ...state,
      chat: [...state.chat, action.payload],
    }))
    .addCase(pictionaryRightGuess, state => ({
      ...state,
      chat: [
        ...state.chat,
        {
          system: SystemMessage.GuessedRight,
          player: null,
          message: i18n('pictionary')`Guessed right`,
        },
      ],
    }))
    .addCase(gameStopped, () => initialState)
);
