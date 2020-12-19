import { createAction } from '@reduxjs/toolkit';
import { GameStoppedMessage } from '../../app/matchmaking/matchmaking.api';

export const gameStopped = createAction<GameStoppedMessage>('game/stopped');
