import { getLobby } from '../lobby-store.js';
import { subscribeToMessage } from '../message-broker.js';
import { broadcastToLobby } from '../socket.js';

export function lobbyPlayersChangedSubscriber(code) {
    const lobby = getLobby(code);
    broadcastToLobby(code, {
        type: 'lobby/players-changed',
        players: lobby.players
    });
}

export function setup() {
    subscribeToMessage('lobby-players-changed', lobbyPlayersChangedSubscriber);
}