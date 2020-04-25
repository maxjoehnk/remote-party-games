import { subscribeLobbyClosed } from '../../app/matchmaking/matchmaking.api';
import { leaveLobby } from '../actions/lobby';

export function lobbyClosedSubscriber(dispatch: (action) => void) {
    subscribeLobbyClosed(msg => {
        dispatch(leaveLobby());
    });
}