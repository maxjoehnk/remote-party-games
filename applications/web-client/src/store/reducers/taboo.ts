import { createReducer } from '@reduxjs/toolkit';
import { tabooGameUpdate } from '../actions/taboo';
import { TabooGameState } from '../../contracts/taboo-game-configuration';


export const tabooReducer = createReducer<TabooGameState>({
    currentCard: null,
    teamOne: {
        players: [],
        points: 0
    },
    teamTwo: {
        players: [],
        points: 0
    },
    currentRound: {
        timeLeft: 60,
        activePlayer: null,
        team: 1
    },
    view: null
}, {
    [tabooGameUpdate]: (state: TabooGameState, action) => action.payload
});