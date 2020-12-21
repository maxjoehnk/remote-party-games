import { createSelector } from '@reduxjs/toolkit';
import { ApplicationState } from '../index';

export const selectCurrentTabooCard = createSelector(
  (state: ApplicationState) => state.taboo,
  taboo => taboo.currentCard
);

export const selectTabooScore = createSelector(
  (state: ApplicationState) => state.taboo,
  taboo => [taboo.teamOne.points, taboo.teamTwo.points]
);

export const selectTabooView = createSelector(
  (state: ApplicationState) => state.taboo,
  taboo => taboo.view
);

export const selectTabooTimeLeft = createSelector(
  (state: ApplicationState) => state.taboo,
  taboo => taboo.currentRound.timeLeft
);

export const selectTabooCurrentRound = createSelector(
  (state: ApplicationState) => state.taboo,
  taboo => taboo.currentRound
);

export const selectTabooPastCards = createSelector(
  (state: ApplicationState) => state.taboo,
  taboo => taboo.cards
);
