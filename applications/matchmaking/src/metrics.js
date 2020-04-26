import prometheus from 'prom-client';
import { getLobbyMetrics } from './lobby-store.js';
import { getOpenConnectionCount } from './socket.js';

prometheus.collectDefaultMetrics();
const connectedPlayerGauge = new prometheus.Gauge({
    name: 'matchmaking_open_sockets',
    help: 'Count of currently open sockets'
});
const lobbyGauge = new prometheus.Gauge({
    name: 'matchmaking_lobbies',
    help: 'Count of open lobbies'
});
const playerGauge = new prometheus.Gauge({
    name: 'matchmaking_players',
    help: 'Count of players connected to lobbies'
});
const gameGauge = new prometheus.Gauge({
    name: 'matchmaking_games',
    help: 'Count of games currently running'
});

export function getMetrics() {
    const connectedPlayers = getOpenConnectionCount();
    connectedPlayerGauge.set(connectedPlayers);
    const lobbyMetrics = getLobbyMetrics();
    lobbyGauge.set(lobbyMetrics.lobbyCount);
    playerGauge.set(lobbyMetrics.playerCount);
    gameGauge.set(lobbyMetrics.gameCount);

    return prometheus.register.metrics();
}