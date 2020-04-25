import { TabooCardModel } from './taboo-card';

export interface TabooGameConfiguration {
    timer: number;
    teamOne: string[];
    teamTwo: string[];
}

export interface TabooGameState {
    teamOne: TabooTeamState;
    teamTwo: TabooTeamState;
    currentRound?: {
        team: 1 | 2;
        activePlayer: string;
        timeLeft: number;
    };
    currentCard: TabooCardModel | null;
    view: TabooView;
}

export enum TabooView {
    Explaining = 0,
    Guessing = 1,
    Observing = 2
}

export interface TabooTeamState {
    players: string[];
    points: number;
}
