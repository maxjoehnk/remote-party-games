import { createReducer } from '@reduxjs/toolkit';
import { PlayerModel } from '../../contracts/player.model';
import { joinLobby, leaveLobby, lobbyUpdated } from '../actions/lobby';
import { TeamModel } from '../../contracts/team.model';
import { GameHistoryModel } from '../../contracts/history.model';
import { LobbyGameConfigModel } from '../../contracts/lobby.model';

export interface LobbyState {
  players: PlayerModel[];
  teams: TeamModel[];
  code: string;
  game: LobbyGameConfigModel;
  history: GameHistoryModel[];
}

export const lobbyReducer = createReducer<LobbyState>(
  {
    players: [],
    teams: [],
    code: null,
    game: null,
    history: [],
  },
  builder =>
    builder
      .addCase(joinLobby, (state, action) => {
        state.code = action.payload;
      })
      .addCase(leaveLobby, (state, action) => {
        state = null;
      })
      .addCase(lobbyUpdated, (state, action) => {
        state.players = action.payload.players;
        state.teams = action.payload.teams;
        state.history = action.payload.history;
        state.game = action.payload.game;
      })
);
