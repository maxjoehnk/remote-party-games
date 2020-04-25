import { createReducer } from '@reduxjs/toolkit';
import { PlayerModel } from '../../contracts/player.model';
import { joinLobby, leaveLobby, lobbyUpdated } from '../actions/lobby';
import { TeamModel } from '../../contracts/team.model';

export interface LobbyState {
    players: PlayerModel[];
    teams: TeamModel[];
    code: string;
}

export const lobbyReducer = createReducer<LobbyState>({
    players: [],
    teams: [],
    code: null
}, {
    [joinLobby]: (state, action) => {
        state.code = action.payload
    },
    [leaveLobby]: (state, action) => {
        state = null;
    },
    [lobbyUpdated]: (state, action) => {
        state.players = action.payload.players;
        state.teams = action.payload.teams;
    }
});