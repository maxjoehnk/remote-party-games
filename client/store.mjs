import { LobbyPlayersChanged } from './actions.mjs';
import { onMessage } from './socket.mjs';

const subscribers = [];

export let state = {
    username: '',
    players: []
};

function reducer(state, action) {
    switch (action.type) {
        case LobbyPlayersChanged.type:
            return {
                ...state,
                players: action.players
            };
        default:
            return state;
    }
}

export function dispatch(action) {
    state = reducer(state, action);
    for (const subscriber of subscribers) {
        subscriber(state);
    }
}

export function onStateChange(callback) {
    subscribers.push(callback);
}

onMessage('lobby/players-changed', msg => {
    dispatch(LobbyPlayersChanged(msg.players));
});

