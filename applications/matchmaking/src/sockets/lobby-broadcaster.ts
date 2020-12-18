import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket-gateway';
import { LobbyStore } from '../lobby-store';

@Injectable()
export class LobbyBroadcaster {
  constructor(
    private socketGateway: SocketGateway,
    private lobbyStore: LobbyStore
  ) {}

  async broadcastToLobby(lobbyCode: string, msg: any) {
    const lobby = await this.lobbyStore.getLobby(lobbyCode);
    this.socketGateway.broadcast(msg, (ws, playerId) =>
      lobby.players.some((p) => p.id === playerId)
    );
  }
}
