export async function createLobby() {
    const res = await fetch({
        url: '/api/lobby',
        method: 'POST'
    });
    return await res.json();
}

export async function getLobby(code) {
    const res = await fetch({
        url: `/api/lobby/${code}`
    });
    return await res.json();
}