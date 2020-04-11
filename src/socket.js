import uuid from 'uuid';
import WebSocket from 'ws';
import { getLobby } from './lobby-store.js';
import { joinLobbySocketHandler } from './socket-handlers/join-lobby.js';

const handlers = new Map();
handlers.set('lobby/join', joinLobbySocketHandler);

export function setupSocketServer(httpServer) {
    const wss = new WebSocket.Server({ server: httpServer });

    wss.on('connection', ws => {
        ws.playerId = uuid.v4();
        ws.on('message', data => {
            const msg = JSON.parse(data);
            console.log('[Socket] Received message', msg);
            const handler = handlers.get(msg.type);
            const messages = handler(msg);

        });
    });
}

export function broadcastToLobby(wss, lobbyCode, msg) {
    const lobby = getLobby(lobbyCode);
    wss.clients.forEach(ws => {
        if (ws.readyState !== WebSocket.OPEN) {
            return;
        }
        if (!lobby.players.includes(ws.playerId)) {
            return;
        }
        ws.send(JSON.stringify(msg));
    });
}