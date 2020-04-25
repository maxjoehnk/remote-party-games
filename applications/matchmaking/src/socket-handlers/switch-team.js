import { lobbyChangedBrokerMsg } from '../contracts/broker-messages.js';
import { getLobbyCodeForPlayer, switchTeam } from '../lobby-store.js';
import { emitMessage } from '../message-broker.js';

export function switchTeamSocketHandler(ws, msg) {
    const lobbyCode = getLobbyCodeForPlayer(ws.playerId);
    if (lobbyCode == null) {
        return;
    }
    switchTeam(lobbyCode, { id: ws.playerId, name: ws.playerName }, msg.teamId);
    emitMessage(lobbyChangedBrokerMsg, lobbyCode);
}