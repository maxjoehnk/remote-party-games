import { createSelector } from '@reduxjs/toolkit';
import { ApplicationState } from '../index';

export const selectPlayerList = createSelector(
    (state: ApplicationState) => state.lobby,
    lobby => lobby.players
);

export const selectTeams = createSelector(
    (state: ApplicationState) => state.lobby,
    lobby => lobby.teams
);

export const selectLobbyCode = createSelector(
    (state: ApplicationState) => state.lobby,
    lobby => lobby.code
);

export const selectGameHistory = createSelector(
  (state: ApplicationState) => state.lobby,
  lobby => lobby.history
);

export const selectGameType = createSelector(
    (state: ApplicationState) => state.lobby,
    lobby => lobby.game?.type
);

export const selectGameConfig = createSelector(
  (state: ApplicationState) => state.lobby,
  lobby => lobby.game?.config
);
