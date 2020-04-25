import { getGame, getLobbyCodeForPlayer } from '../lobby-store.js';

export function gameActionHandler(ws, msg) {
    const lobbyCode = getLobbyCodeForPlayer(ws.playerId);
    if (!lobbyCode) {
        return;
    }
    const game = getGame(lobbyCode);
    game.execute(msg);
}
