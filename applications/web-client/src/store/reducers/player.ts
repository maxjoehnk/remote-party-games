import { createReducer } from '@reduxjs/toolkit';
import { playerConfigurationChanged, updatePlayerName } from '../actions/player';

export interface PlayerState {
    id: string;
    name: string;
}

export const playerReducer = createReducer<PlayerState>({ id: null, name: null }, {
    [updatePlayerName]: (state, action) => {
        state.name = action.payload;
    },
    [playerConfigurationChanged]: (state, action) => {
        state.id = action.payload.id;
    }
});