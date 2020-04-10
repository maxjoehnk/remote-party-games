import crypto from 'crypto';
import { promisify } from 'util';

const CODE_BYTES = 3;
const randomBytes = promisify(crypto.randomBytes);

const lobbies = new Map();

export function getLobby(code) {
    return lobbies.get(code);
}

export async function createLobby() {
    const bytes = await randomBytes(CODE_BYTES);
    const code = bytes.toString('base64');
    const lobby = createEmptyLobby(code);
    lobbies.set(code, lobby);

    return lobby;
}

function createEmptyLobby(code) {
    return {
        code,
        players: []
    };
}