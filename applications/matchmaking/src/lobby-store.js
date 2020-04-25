import crypto from 'crypto';
import { promisify } from 'util';
import { createGame } from './games/index.js';
import uuid from 'uuid';
const randomBytes = promisify(crypto.randomBytes);

const CODE_BYTES = 3;

const lobbies = new Map();
const players = new Map();
const games = new Map();

export function getLobby(code) {
    return lobbies.get(code);
}

export function getLobbyCodeForPlayer(playerId) {
    const lobby = players.get(playerId);
    if (lobby && lobbies.has(lobby)) {
        return lobby;
    }
    return null;
}

async function createLobbyId() {
    let code = null;
    do {
        const bytes = await randomBytes(CODE_BYTES);
        code = bytes.toString('base64');
    }while (code.includes('/'));
    return code;
}

export async function createLobby() {
    const code = await createLobbyId();
    const lobby = createEmptyLobby(code);
    lobbies.set(code, lobby);

    return lobby;
}

export function joinLobby(player, lobbyCode) {
    console.log(`[Lobby] ${player.name} (${player.id}) is joining ${lobbyCode}`);
    const lobby = getLobby(lobbyCode);
    if (lobby == null) {
        throw new Error(`Unknown Lobby ${lobbyCode}`);
    }
    players.set(player.id, lobbyCode);
    lobby.players.push(player);
    joinTeamWhenAvailable(lobby, player.id);
    return games.get(lobbyCode);
}

function joinTeamWhenAvailable(lobby, playerId) {
    let lowestMembers = Number.MAX_VALUE;
    let teamId = null;
    for (const team of lobby.teams) {
        if (team.players.length < lowestMembers) {
            lowestMembers = team.players.length;
            teamId = team.id;
        }
    }
    if (teamId == null) {
        return;
    }
    const team = lobby.teams.find(t => t.id === teamId);
    team.players.push(playerId);
}

export function disconnectPlayer(player, lobbyCode) {
    console.log(`[Lobby] ${player.name} (${player.id}) is disconnected`);
    players.delete(player.id);
    const lobby = getLobby(lobbyCode);
    lobby.players = lobby.players.filter(p => p.id !== player.id);
    removePlayerFromTeam(lobby.teams, player.id);
    removeEmptyLobby(lobby);
}

function removePlayerFromTeam(teams, playerId) {
    for (const team of teams) {
        team.players = team.players.filter(id => id !== playerId);
    }
}

function removeEmptyLobby(lobby) {
    if (lobby.players.length === 0) {
        lobbies.delete(lobby.code);
    }
    const game = games.get(lobby.code);
    if (game != null) {
        game.destroy();
        games.delete(lobby.code);
    }
}

export function startGameInLobby(lobbyCode) {
    console.log(`[Lobby] Starting game in lobby ${lobbyCode}`);
    const lobby = getLobby(lobbyCode);
    if (lobby == null) {
        throw new Error(`Unknown Lobby ${lobbyCode}`);
    }
    const game = createGame(lobby.game, lobby.teams);
    games.set(lobbyCode, game);
    game.start();
    return game;
}

export function switchTeam(lobbyCode, player, teamId) {
    console.log(`[Lobby] Switching player ${player.name} (${player.id}) to team ${teamId} in lobby ${lobbyCode}`);
    const lobby = getLobby(lobbyCode);
    if (lobby == null) {
        throw new Error(`Unknown Lobby ${lobbyCode}`);
    }
    const team = lobby.teams.find(t => t.id === teamId);
    if (team == null) {
        throw new Error(`Unknown Team ${teamId}`);
    }
    for (const t of lobby.teams) {
        t.players = t.players.filter(playerId => playerId !== player.id);
    }
    team.players.push(player.id);
}

export function getGame(lobbyCode) {
    return games.get(lobbyCode);
}

function createEmptyLobby(code) {
    return {
        code,
        players: [],
        game: 'taboo',
        teams: [{
            id: uuid.v4(),
            name: 'Team 1',
            players: []
        }, {
            id: uuid.v4(),
            name: 'Team 2',
            players: []
        }]
    };
}

export function getLobbyMetrics() {
    const lobbyCount = lobbies.size;
    const playerCount = players.size;
    const gameCount = games.size;

    return {
        lobbyCount,
        playerCount,
        gameCount
    };
}