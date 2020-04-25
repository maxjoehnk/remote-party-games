import uuid from 'uuid';
import WebSocket from 'ws';
import { playerDisconnectBrokerMsg } from './contracts/broker-messages.js';
import { getLobby } from './lobby-store.js';
import { emitMessage } from './message-broker.js';
import { gameActionHandler } from './socket-handlers/game-action.js';
import { joinLobbySocketHandler } from './socket-handlers/join-lobby.js';
import { startGameHandler } from './socket-handlers/start-game.js';
import { switchTeamSocketHandler } from './socket-handlers/switch-team.js';
import { updateUsernameHandler } from './socket-handlers/update-username.js';

let wss;

const handlers = new Map();
handlers.set('lobby/join', joinLobbySocketHandler);
handlers.set('user/username', updateUsernameHandler);
handlers.set('lobby/start-game', startGameHandler);
handlers.set('lobby/switch-team', switchTeamSocketHandler);
handlers.set('game/action', gameActionHandler);

export function setupSocketServer(httpServer) {
    wss = new WebSocket.Server({ server: httpServer });

    wss.on('connection', ws => {
        ws.playerId = uuid.v4();
        console.log(`[Socket] Player ${ws.playerId} joined`);

        ws.send(JSON.stringify({
            type: 'user/initial-configuration',
            configuration: {
                id: ws.playerId
            }
        }));

        ws.on('message', data => {
            const msg = JSON.parse(data);
            console.log('[Socket] Received message', msg);
            const handler = handlers.get(msg.type);
            if (!handler) {
                console.warn('[Socket] No handler for message', msg.type);
                return;
            }
            handler(ws, msg);
        });
        ws.on('close', () => {
            emitMessage(playerDisconnectBrokerMsg, { id: ws.playerId, name: ws.playerName });
        });
    });
}

export function broadcastToLobby(lobbyCode, msg) {
    const lobby = getLobby(lobbyCode);
    broadcastMessage(msg, ws => !!lobby.players.find(p => p.id === ws.playerId));
}

export function broadcastMessage(msg, clientFilter = () => true) {
    // console.log('[Socket] Broadcasting message', msg);
    wss.clients.forEach(ws => {
        if (ws.readyState !== WebSocket.OPEN) {
            return;
        }
        if (!clientFilter(ws)) {
            return;
        }
        ws.send(JSON.stringify(msg));
    });
}

export function sendMessage(ws, msg) {
    ws.send(JSON.stringify(msg));
}
