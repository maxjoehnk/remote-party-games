import { createAction } from '@reduxjs/toolkit';
import { TabooGameState } from '../../contracts/taboo-game-configuration';

export const tabooGameUpdate = createAction<TabooGameState>('taboo/game-update');