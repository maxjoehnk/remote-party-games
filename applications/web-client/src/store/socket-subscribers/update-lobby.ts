import { subscribeLobbyChanges } from '../../app/matchmaking/matchmaking.api';
import { lobbyUpdated } from '../actions/lobby';
import { Store } from 'redux';
import { ApplicationState } from '../index';

export function updateLobbySubscriber(store: Store<ApplicationState>) {
    subscribeLobbyChanges(msg => {
        store.dispatch(lobbyUpdated(msg));
    });
}
