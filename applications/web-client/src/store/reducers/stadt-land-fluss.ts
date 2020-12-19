import { createReducer } from '@reduxjs/toolkit';
import { StadtLandFlussGameState } from '../../contracts/stadt-land-fluss-configuration';
import { stadtLandFlussGameUpdate } from '../actions/stadt-land-fluss';
import { gameStopped } from '../actions/game';

const initialState: StadtLandFlussGameState = {
  letter: null,
  running: true,
};

export const stadtLandFlussReducer = createReducer<StadtLandFlussGameState>(initialState, builder =>
  builder
    .addCase(stadtLandFlussGameUpdate, (state, action) => action.payload)
    .addCase(gameStopped, () => initialState)
);
