import { lobbyChangedBrokerMsg } from '../contracts/broker-messages.js';
import { gameStartedSocketMsg, lobbyClosedSocketMsg } from '../contracts/socket-messages.js';
import { leaveLobby, getLobbyCodeForPlayer, joinLobby } from '../lobby-store.js';
import { emitMessage } from '../message-broker.js';
import { sendMessage } from '../socket.js';

export function joinLobbySocketHandler(ws, msg) {
    const currentLobby = getLobbyCodeForPlayer(ws.playerId);
    if (currentLobby === msg.code) {
        return;
    }
    if (currentLobby != null) {
        leaveLobby({ name: ws.playerName, id: ws.playerId }, currentLobby);
    }

    try {
        const game = joinLobby({ id: ws.playerId, name: ws.playerName }, msg.code);
        if (game != null) {
            sendMessage(ws, {
                type: gameStartedSocketMsg,
                game: game.type,
                gameState: game.state
            });
        }
        emitMessage(lobbyChangedBrokerMsg, msg.code);
    }catch (err) {
        console.error(err);
        sendMessage(ws, {
            type: lobbyClosedSocketMsg,
            code: msg.code
        });
    }
}