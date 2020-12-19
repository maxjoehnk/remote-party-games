import { createAction } from '@reduxjs/toolkit';
import { LobbyChangedMessage } from '../../app/matchmaking/matchmaking.api';

export const lobbyUpdated = createAction<LobbyChangedMessage>('lobby/update');
export const joinLobby = createAction<string>('lobby/join');
export const leaveLobby = createAction('lobby/leave');
