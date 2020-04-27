import { createAction } from '@reduxjs/toolkit';
import { PlayerModel } from '../../contracts/player.model';

export const loadPlayer = createAction<PlayerModel>('player/load');
export const updatePlayerName = createAction<string>('player/update-name');
