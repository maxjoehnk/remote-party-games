import { gameStartedSocketMsg } from '../contracts/socket-messages.js';
import { getLobbyCodeForPlayer, startGameInLobby } from '../lobby-store.js';
import { broadcastToLobby } from '../socket.js';

export function startGameHandler(ws, msg) {
    const lobbyCode = getLobbyCodeForPlayer(ws.playerId);
    if (!lobbyCode) {
        return;
    }
    const game = startGameInLobby(lobbyCode);
    broadcastToLobby(lobbyCode, {
        type: gameStartedSocketMsg,
        game: game.type,
        gameState: game.state
    });
}