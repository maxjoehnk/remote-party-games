import { joinLobby } from '../actions/lobby';
import * as matchmakingApi from '../../app/matchmaking/matchmaking.api';

export function joinLobbyListener(state, action) {
    if (action.type !== joinLobby.type) {
        return;
    }
    matchmakingApi.joinLobby(action.payload);
}