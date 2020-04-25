import { lobbyChangedBrokerMsg } from '../contracts/broker-messages.js';
import { lobbyChangedSocketMsg } from '../contracts/socket-messages.js';
import { getLobby } from '../lobby-store.js';
import { subscribeToMessage } from '../message-broker.js';
import { broadcastToLobby } from '../socket.js';

export function lobbyChangedSubscriber(code) {
    const lobby = getLobby(code);
    broadcastToLobby(code, {
        type: lobbyChangedSocketMsg,
        players: lobby.players,
        teams: lobby.teams
    });
}

export function setup() {
    subscribeToMessage(lobbyChangedBrokerMsg, lobbyChangedSubscriber);
}