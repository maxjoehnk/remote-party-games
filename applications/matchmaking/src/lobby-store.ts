import { Injectable } from '@nestjs/common';
import { Player } from './contracts/player';
import { Game } from './contracts/game';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { Lobby } from './contracts/lobby';
import { v4 as uuid } from 'uuid';
import { Team } from './contracts/team';
import { GameFactory } from './games/factory';

const randomBytes = promisify(crypto.randomBytes);

const CODE_BYTES = 3;

@Injectable()
export class LobbyStore {
  private readonly lobbies = new Map<string, Lobby>();
  // PlayerId => lobby code
  private readonly players = new Map<string, string>();
  private readonly games = new Map<string, Game>();

  constructor(private gameFactory: GameFactory) {}

  async getLobby(lobbyCode: string): Promise<Lobby> {
    return this.lobbies.get(lobbyCode);
  }

  async getLobbyCodeForPlayer(playerId: string): Promise<string> {
    const lobbyCode = this.players.get(playerId);
    if (lobbyCode && this.lobbies.has(lobbyCode)) {
      return lobbyCode;
    }
    return null;
  }

  async createLobby(): Promise<Lobby> {
    const code = await LobbyStore.createLobbyId();
    const lobby = LobbyStore.createEmptyLobby(code);
    this.lobbies.set(code, lobby);

    return lobby;
  }

  async joinLobby(player: Player, lobbyCode: string): Promise<Game | null> {
    console.log(
      `[Lobby] ${player.name} (${player.id}) is joining ${lobbyCode}`
    );
    const lobby = await this.getLobby(lobbyCode);
    if (lobby == null) {
      throw new Error(`Unknown Lobby ${lobbyCode}`);
    }
    this.players.set(player.id, lobbyCode);
    lobby.players.push(player);
    this.joinTeamWhenAvailable(lobby, player.id);
    return this.games.get(lobbyCode);
  }

  async leaveLobby(player: Player, lobbyCode: string): Promise<void> {
    console.log(`[Lobby] ${player.name} (${player.id}) is disconnected`);
    this.players.delete(player.id);
    const lobby = await this.getLobby(lobbyCode);
    lobby.players = lobby.players.filter((p) => p.id !== player.id);
    this.removePlayerFromTeam(lobby.teams, player.id);
    await this.removeEmptyLobby(lobby);
  }

  async startGameInLobby(lobbyCode: string) {
    console.log(`[Lobby] Starting game in lobby ${lobbyCode}`);
    const lobby = await this.getLobby(lobbyCode);
    if (lobby == null) {
      throw new Error(`Unknown Lobby ${lobbyCode}`);
    }
    const game = this.gameFactory.createGame(lobby.game, lobby.teams);
    this.games.set(lobbyCode, game);
    await game.start();

    return game;
  }

  async stopGameInLobby(lobbyCode: string) {
    console.log(`[Lobby] Stopping game in lobby ${lobbyCode}`);
    const lobby = await this.getLobby(lobbyCode);
    if (lobby == null) {
      throw new Error(`Unknown Lobby ${lobbyCode}`);
    }
    const game = await this.getGameForLobby(lobbyCode);
    await game.stop();
    this.games.delete(lobbyCode);
  }

  async switchTeam(lobbyCode: string, player: Player, teamId: string) {
    console.log(
      `[Lobby] Switching player ${player.name} (${player.id}) to team ${teamId} in lobby ${lobbyCode}`
    );
    const lobby = await this.getLobby(lobbyCode);
    if (lobby == null) {
      throw new Error(`Unknown Lobby ${lobbyCode}`);
    }
    const team = lobby.teams.find((t) => t.id === teamId);
    if (team == null) {
      throw new Error(`Unknown Team ${teamId}`);
    }
    for (const t of lobby.teams) {
      t.players = t.players.filter((playerId) => playerId !== player.id);
    }
    team.players.push(player.id);
  }

  async getGameForLobby(lobbyCode: string): Promise<Game> {
    return this.games.get(lobbyCode);
  }

  getLobbyMetrics() {
    const lobbyCount = this.lobbies.size;
    const playerCount = this.players.size;
    const gameCount = this.games.size;

    return {
      lobbyCount,
      playerCount,
      gameCount,
    };
  }

  private static async createLobbyId(): Promise<string> {
    let code = null;
    do {
      const bytes = await randomBytes(CODE_BYTES);
      code = bytes.toString('base64');
    } while (code.includes('/'));
    return code;
  }

  private static createEmptyLobby = (code: string): Lobby => ({
    code,
    players: [],
    game: 'taboo',
    teams: [
      {
        id: uuid(),
        name: 'Team 1',
        players: [],
      },
      {
        id: uuid(),
        name: 'Team 2',
        players: [],
      },
    ],
  });

  private joinTeamWhenAvailable(lobby: Lobby, playerId: string) {
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
    const team = lobby.teams.find((t) => t.id === teamId);
    team.players.push(playerId);
  }

  private removePlayerFromTeam(teams: Team[], playerId: string) {
    for (const team of teams) {
      team.players = team.players.filter((id) => id !== playerId);
    }
  }

  private async removeEmptyLobby(lobby: Lobby) {
    if (lobby.players.length === 0) {
      this.lobbies.delete(lobby.code);
    }
    const game = this.games.get(lobby.code);
    if (game != null) {
      await game.stop();
      this.games.delete(lobby.code);
    }
  }
}
