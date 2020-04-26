import { lobbyChangedBrokerMsg, playerDisconnectBrokerMsg } from '../contracts/broker-messages.js';
import { getLobbyCodeForPlayer, leaveLobby } from '../lobby-store.js';
import { emitMessage, subscribeToMessage } from '../message-broker.js';

export function lobbyPlayersChangedSubscriber(player) {
    const code = getLobbyCodeForPlayer(player.id);
    if (code == null) {
        return;
    }
    leaveLobby(player, code);
    emitMessage(lobbyChangedBrokerMsg, code);
}

export function setup() {
    subscribeToMessage(playerDisconnectBrokerMsg, lobbyPlayersChangedSubscriber);
}
