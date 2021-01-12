import { createSelector } from '@reduxjs/toolkit';
import { ApplicationState } from '../index';
import { PictionaryState } from '../reducers/pictionary';
import { PlayerModel } from '../../contracts/player.model';

const pictionarySelector = (state: ApplicationState): PictionaryState => state.pictionary;

export const selectPictionaryTimeLeft = createSelector(
  pictionarySelector,
  pictionary => pictionary.currentRound?.timeLeft
);

export const selectPictionaryWordToDraw = createSelector(
  pictionarySelector,
  pictionary => pictionary.currentRound?.word
);

export const selectPictionaryAvailableWords = createSelector(
  pictionarySelector,
  pictionary => pictionary.currentRound?.wordsToChooseFrom
);

export const selectPictionaryCurrentRound = createSelector(
  pictionarySelector,
  pictionary => pictionary.currentRound
);

export const selectPictionaryCurrentView = createSelector(
  pictionarySelector,
  pictionary => pictionary.currentRound?.view
);

export const selectPictionaryChat = createSelector(
  pictionarySelector,
  pictionary => pictionary.chat
);

export const selectPictionaryScores = createSelector(
  pictionarySelector,
  (state: ApplicationState) => state.lobby.players,
  (pictionary, players) =>
    pictionary.currentRound?.rankings.map(ranking => ({
      ...ranking,
      player: players.find(p => p.id === ranking.player),
    }))
);

export const selectPictionaryCurrentPlayer = createSelector(
  pictionarySelector,
  (state: ApplicationState) => state.lobby.players,
  (pictionary, players) => players.find(p => p.id === pictionary.currentRound.drawingPlayer)
);

export const selectPictionaryPlayerList = createSelector(
  pictionarySelector,
  (state: ApplicationState) => state.lobby.players,
  (pictionary, players): ScorePlayer[] =>
    players.map(player => {
      const ranking = pictionary.scores.find(r => r.player === player.id);
      return {
        ...player,
        score: ranking?.points ?? 0,
      };
    })
);

export interface ScorePlayer extends PlayerModel {
  score: number;
}
