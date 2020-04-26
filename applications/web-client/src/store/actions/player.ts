import { createAction } from '@reduxjs/toolkit';
import { UserConfigurationModel } from '../../contracts/user-configuration.model';

export const updatePlayerName = createAction<string>('player/update-name');
export const playerConfigurationChanged = createAction<UserConfigurationModel>(
    'player/configuration-updated'
);
