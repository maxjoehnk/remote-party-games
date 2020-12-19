import { createReducer } from '@reduxjs/toolkit';
import { tabooGameUpdate } from '../actions/taboo';
import { TabooGameState } from '../../contracts/taboo-game-configuration';
import { gameStopped } from '../actions/game';

const initialState: TabooGameState = {
  currentCard: null,
  teamOne: {
    players: [],
    points: 0,
  },
  teamTwo: {
    players: [],
    points: 0,
  },
  currentRound: {
    timeLeft: 60,
    activePlayer: null,
    team: 1,
  },
  view: null,
};

export const tabooReducer = createReducer<TabooGameState>(initialState, builder =>
  builder
    .addCase(tabooGameUpdate, (state, action) => action.payload)
    .addCase(gameStopped, () => initialState)
);
