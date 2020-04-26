import { createSelector } from '@reduxjs/toolkit';
import { ApplicationState } from '../index';

export const selectPlayer = createSelector(
    (state: ApplicationState) => state.player,
    player => player
);
