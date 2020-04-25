import { playerDisconnectBrokerMsg } from '../contracts/broker-messages.js';
import { lobbyChangedSocketMsg } from '../contracts/socket-messages.js';
import { getLobbyCodeForPlayer, leaveLobby } from '../lobby-store.js';
import { emitMessage, subscribeToMessage } from '../message-broker.js';

export function lobbyPlayersChangedSubscriber(player) {
    const code = getLobbyCodeForPlayer(player.id);
    if (code == null) {
        return;
    }
    leaveLobby(player, code);
    emitMessage(lobbyChangedSocketMsg, code);
}

export function setup() {
    subscribeToMessage(playerDisconnectBrokerMsg, lobbyPlayersChangedSubscriber);
}
