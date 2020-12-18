import { Controller, Get, Param, Post } from '@nestjs/common';
import { LobbyStore } from '../lobby-store';
import { Lobby } from '../contracts/lobby';

@Controller('/api/lobby')
export class LobbyController {
  constructor(private lobbyStore: LobbyStore) {}

  @Get(':code')
  async getLobby(@Param('code') code: string): Promise<Lobby> {
    const lobby = await this.lobbyStore.getLobby(code);
    console.log(`[Lobby] Fetching Lobby ${code}`);

    return lobby;
  }

  @Post()
  async createLobby(): Promise<Lobby> {
    const lobby = await this.lobbyStore.createLobby();
    console.log('[Lobby] Created new lobby', lobby);

    return lobby;
  }
}
