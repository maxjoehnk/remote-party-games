import { createSelector } from '@reduxjs/toolkit';
import { ApplicationState } from '../index';
import { LobbyState } from '../reducers/lobby';
import { PlayerModel } from '../../contracts/player.model';

export const selectCurrentStadtLandFlussLetter = createSelector(
  (state: ApplicationState) => state.stadtLandFluss,
  state => state.letter
);

export const selectStadtLandFlussColumns = createSelector<ApplicationState, LobbyState, string[]>(
  (state: ApplicationState) => state.lobby,
  lobby => lobby.game?.config.columns ?? []
);

export const selectStadtLandFlussTimeLeft = createSelector(
  (state: ApplicationState) => state.stadtLandFluss,
  state => 300
);

export const selectStadtLandFlussRunning = createSelector(
  (state: ApplicationState) => state.stadtLandFluss,
  state => state.running
);

export const selectStadtLandFlussResults = createSelector(
  (state: ApplicationState) => state.player.id,
  (state: ApplicationState) => state.stadtLandFluss,
  (state: ApplicationState) => state.lobby.players,
  (playerId: string, state, players) => {
    const columns: ResultColumn[] = state.columns.map((name, i) => ({
      name,
      answers: state.players.map(playerState => ({
        answer: playerState.columns[i],
        score: playerState.scores[i],
        upvotes: playerState.upvotes[i].voterIds.length,
        upvoted: playerState.upvotes[i].voterIds.includes(playerId),
        denied: playerState.denied[i],
        player: players.find(p => playerState.playerId === p.id),
      })),
    }));

    return columns;
  }
);

export const selectStadtLandFlussPlayerScores = createSelector(
  (state: ApplicationState) => state.stadtLandFluss,
  state => {
    const players = {};
    for (const player of state.players) {
      players[player.playerId] = player.points;
    }

    return players;
  }
);

export interface ResultColumn {
  name: string;
  answers: ResultAnswer[];
}

export interface ResultAnswer {
  answer: string;
  score: number;
  upvotes: number;
  upvoted: boolean;
  denied: boolean;
  player: PlayerModel;
}
