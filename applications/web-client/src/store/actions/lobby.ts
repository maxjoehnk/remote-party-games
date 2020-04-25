import { createAction } from '@reduxjs/toolkit';
import { PlayerModel } from '../../contracts/player.model';
import { TeamModel } from '../../contracts/team.model';

export const lobbyUpdated = createAction<{ players: PlayerModel[]; teams: TeamModel[]; }>('lobby/update');
export const joinLobby = createAction<string>('lobby/join');
export const leaveLobby = createAction('lobby/leave');