import { joinLobby } from '../lobby-store.js';
import { emitMessage } from '../message-broker.js';

export function joinLobbySocketHandler(ws, msg) {
    joinLobby({ id: ws.playerId, name: ws.playerName }, msg.code);
    emitMessage('lobby-players-changed', msg.code);
}