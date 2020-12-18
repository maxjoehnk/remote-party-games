import { createAction } from '@reduxjs/toolkit';
import { PlayerModel } from '../../contracts/player.model';
import { TeamModel } from '../../contracts/team.model';
import { GameHistoryModel } from '../../contracts/history.model';

export const lobbyUpdated = createAction<{
    players: PlayerModel[];
    teams: TeamModel[];
    history: GameHistoryModel[];
}>('lobby/update');
export const joinLobby = createAction<string>('lobby/join');
export const leaveLobby = createAction('lobby/leave');
