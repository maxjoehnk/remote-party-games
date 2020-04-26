import { gameStoppedSocketMsg } from '../contracts/socket-messages.js';
import { getLobbyCodeForPlayer, stopGameInLobby } from '../lobby-store.js';
import { broadcastToLobby } from '../socket.js';

export function stopGameHandler(ws) {
    const lobbyCode = getLobbyCodeForPlayer(ws.playerId);
    if (!lobbyCode) {
        return;
    }
    stopGameInLobby(lobbyCode);
    broadcastToLobby(lobbyCode, {
        type: gameStoppedSocketMsg,
        code: lobbyCode
    });
}