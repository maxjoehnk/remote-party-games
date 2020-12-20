import { createReducer } from '@reduxjs/toolkit';
import { loadPlayer, updatePlayerName } from '../actions/player';
import { PlayerModel } from '../../contracts/player.model';

export const playerReducer = createReducer<PlayerModel>({ id: null, name: null }, builder =>
  builder
    .addCase(updatePlayerName, (state, action) => {
      state.name = action.payload;
    })
    .addCase(loadPlayer, (state, action) => action.payload)
);
