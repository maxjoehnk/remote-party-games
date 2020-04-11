import crypto from 'crypto';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);

const CODE_BYTES = 3;

const lobbies = new Map();
const players = new Map();

export function getLobby(code) {
    return lobbies.get(code);
}

export function getLobbyForPlayer(playerId) {
    const lobby = players.get(playerId);
    if (lobby && lobbies.has(lobby)) {
        return lobby;
    }
    return null;
}

export async function createLobby() {
    const bytes = await randomBytes(CODE_BYTES);
    const code = bytes.toString('base64');
    const lobby = createEmptyLobby(code);
    lobbies.set(code, lobby);

    return lobby;
}

export function joinLobby(player, lobbyCode) {
    players.set(player.id, lobbyCode);
    const lobby = getLobby(lobbyCode);
    lobby.players.push(player);
}

function createEmptyLobby(code) {
    return {
        code,
        players: []
    };
}