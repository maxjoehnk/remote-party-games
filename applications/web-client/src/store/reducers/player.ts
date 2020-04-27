import { createReducer } from '@reduxjs/toolkit';
import { loadPlayer, updatePlayerName } from '../actions/player';

export interface PlayerState {
    id: string;
    name: string;
}

export const playerReducer = createReducer<PlayerState>(
    { id: null, name: null },
    {
        [updatePlayerName]: (state, action) => {
            state.name = action.payload;
        },
        [loadPlayer]: (state, action) => action.payload
    }
);
