import { lobbyChangedBrokerMsg } from '../contracts/broker-messages.js';
import { getLobby, getLobbyCodeForPlayer } from '../lobby-store.js';
import { emitMessage } from '../message-broker.js';

export function updateUsernameHandler(ws, msg) {
    ws.playerName = msg.username;
    const lobbyCode = getLobbyCodeForPlayer(ws.playerId);
    if (!lobbyCode) {
        return;
    }
    const lobby = getLobby(lobbyCode);
    const playerIndex = lobby.players.findIndex(p => p.id === ws.playerId);
    lobby.players[playerIndex].name = ws.playerName;
    emitMessage(lobbyChangedBrokerMsg, lobbyCode);
}