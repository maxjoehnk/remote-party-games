import { collectDefaultMetrics, Gauge, register } from 'prom-client';
import { Injectable } from '@nestjs/common';
import { LobbyStore } from '../lobby-store';

@Injectable()
export class MatchmakingMetrics {
  private lobbyGauge = new Gauge({
    name: 'matchmaking_lobbies',
    help: 'Count of open lobbies',
  });

  private playerGauge = new Gauge({
    name: 'matchmaking_players',
    help: 'Count of players connected to lobbies',
  });

  private gameGauge = new Gauge({
    name: 'matchmaking_games',
    help: 'Count of games currently running',
  });

  constructor(private lobbyStore: LobbyStore) {
    collectDefaultMetrics();
  }

  getMetrics() {
    const lobbyMetrics = this.lobbyStore.getLobbyMetrics();
    this.lobbyGauge.set(lobbyMetrics.lobbyCount);
    this.playerGauge.set(lobbyMetrics.playerCount);
    this.gameGauge.set(lobbyMetrics.gameCount);

    return register.metrics();
  }
}
