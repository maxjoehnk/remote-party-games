import { lobbyChangedBrokerMsg } from '../contracts/broker-messages.js';
import { lobbyClosedSocketMsg } from '../contracts/socket-messages.js';
import { joinLobby } from '../lobby-store.js';
import { emitMessage } from '../message-broker.js';
import { broadcastMessage } from '../socket.js';

export function joinLobbySocketHandler(ws, msg) {
    try {
        joinLobby({ id: ws.playerId, name: ws.playerName }, msg.code);
        emitMessage(lobbyChangedBrokerMsg, msg.code);
    }catch (err) {
        console.error(err);
        broadcastMessage({
            type: lobbyClosedSocketMsg,
            code: msg.code
        });
    }
}