import { subscribeLobbyChanges } from '../../app/matchmaking/matchmaking.api';
import { lobbyUpdated } from '../actions/lobby';

export function updateLobbySubscriber(dispatch: (action) => void) {
    subscribeLobbyChanges(msg => {
        dispatch(lobbyUpdated(msg));
    });
}