import { emit } from './socket.mjs';

export async function createLobby() {
    const res = await fetch('/api/lobby', {
        method: 'POST'
    });
    return await res.json();
}

export async function getLobby(code) {
    const res = await fetch(`/api/lobby/${code}`);
    return await res.json();
}

export function joinLobby(code) {
    emit({
        type: 'lobby/join',
        code
    });
}