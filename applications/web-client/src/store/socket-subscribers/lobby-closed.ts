import { subscribeLobbyClosed } from '../../app/matchmaking/matchmaking.api';
import { leaveLobby } from '../actions/lobby';
import { Store } from 'redux';
import { ApplicationState } from '../index';

export function lobbyClosedSubscriber(store: Store<ApplicationState>) {
    subscribeLobbyClosed(() => {
        store.dispatch(leaveLobby());
    });
}
