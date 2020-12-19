import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribeGameStopped } from '../../app/matchmaking/matchmaking.api';
import { gameStopped } from '../actions/game';

export function gameStoppedSubscriber(store: Store<ApplicationState>) {
    subscribeGameStopped(msg => {
        store.dispatch(gameStopped(msg));
    });
}
