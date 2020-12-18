import { Injectable } from '@nestjs/common';
import { Player } from './contracts/player';

@Injectable()
export class PlayerStore {
  private players = new Map<string, Player>();

  async getPlayer(playerId: string): Promise<Player> {
    if (!this.players.has(playerId)) {
      throw new Error('Player not found');
    }
    return this.players.get(playerId);
  }

  async setPlayer(playerId: string, playerName: string): Promise<void> {
    const player: Player = {
      id: playerId,
      name: playerName,
    };
    this.players.set(playerId, player);
  }
}
