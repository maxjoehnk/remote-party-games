import uuid from 'uuid';
import WebSocket from 'ws';
import { playerDisconnectBrokerMsg } from './contracts/broker-messages.js';
import { getLobby } from './lobby-store.js';
import { emitMessage } from './message-broker.js';
import { gameActionHandler } from './socket-handlers/game-action.js';
import { joinLobbySocketHandler } from './socket-handlers/join-lobby.js';
import { startGameHandler } from './socket-handlers/start-game.js';
import { stopGameHandler } from './socket-handlers/stop-game.js';
import { switchTeamSocketHandler } from './socket-handlers/switch-team.js';
import { updateUsernameHandler } from './socket-handlers/update-username.js';
import { getSocketMetrics } from './metrics/socket.js';
import { parse } from 'url';

const metrics = getSocketMetrics();

let wss;

const handlers = new Map();
handlers.set('lobby/join', joinLobbySocketHandler);
handlers.set('user/username', updateUsernameHandler);
handlers.set('lobby/start-game', startGameHandler);
handlers.set('lobby/stop-game', stopGameHandler);
handlers.set('lobby/switch-team', switchTeamSocketHandler);
handlers.set('game/action', gameActionHandler);

export function setupSocketServer(httpServer) {
    wss = new WebSocket.Server({ server: httpServer });

    wss.on('connection', (ws, req) => {
        const url = parse(req.url, true);
        if (url.query.userId == null) {
            console.warn(`[Socket] Connection opened without user id`);
            return ws.close();
        }
        metrics.openSocketGauge.inc();
        ws.playerId = url.query.userId;
        console.log(`[Socket] Player ${ws.playerId} joined`);

        ws.on('message', data => {
            metrics.socketRecvMessageCounter.inc();
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
            metrics.openSocketGauge.dec();
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
        if (!clientFilter(ws)) {
            return;
        }
        sendMessage(ws, msg);
    });
}

export function sendMessage(ws, msg) {
    if (ws.readyState !== WebSocket.OPEN) {
        return;
    }
    metrics.socketSentMessageCounter.inc();
    ws.send(JSON.stringify(msg));
}

export function getOpenConnectionCount() {
    return wss.clients.size;
}