import uuid from 'uuid';
import WebSocket from 'ws';
import { getLobby } from './lobby-store.js';
import { joinLobbySocketHandler } from './socket-handlers/join-lobby.js';
import { updateUsernameHandler } from './socket-handlers/update-username.js';

let wss;

const handlers = new Map();
handlers.set('lobby/join', joinLobbySocketHandler);
handlers.set('user/username', updateUsernameHandler);

export function setupSocketServer(httpServer) {
    wss = new WebSocket.Server({ server: httpServer });

    wss.on('connection', ws => {
        ws.playerId = uuid.v4();
        ws.on('message', data => {
            const msg = JSON.parse(data);
            console.log('[Socket] Received message', msg);
            const handler = handlers.get(msg.type);
            handler(ws, msg);
        });
    });
}

export function broadcastToLobby(lobbyCode, msg) {
    const lobby = getLobby(lobbyCode);
    broadcastMessage(msg, ws => !!lobby.players.find(p => p.id === ws.playerId));
}

function broadcastMessage(msg, clientFilter = () => true) {
    console.log('[Socket] Broadcasting message', msg);
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