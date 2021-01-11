import { createSelector } from '@reduxjs/toolkit';
import { ApplicationState } from '../index';
import { PictionaryState } from '../reducers/pictionary';

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
