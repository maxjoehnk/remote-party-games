import { getLobbyForPlayer } from '../lobby-store.js';
import { emitMessage } from '../message-broker.js';

export function updateUsernameHandler(ws, msg) {
    ws.playerName = msg.username;
    const lobby = getLobbyForPlayer(ws.playerId);
    if (!lobby) {
        return;
    }
    const playerIndex = lobby.players.findIndex(p => p.id === ws.playerId);
    lobby.players[playerIndex].name = ws.playerName;
    emitMessage('lobby-players-changed', lobby.code);
}