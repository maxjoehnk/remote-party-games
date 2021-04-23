import { Injectable } from '@nestjs/common';
import { LobbyStore } from '../lobby-store';
import { SocketBroadcaster } from './socket-broadcaster';

@Injectable()
export class LobbyBroadcaster {
  constructor(private socketBroadcaster: SocketBroadcaster, private lobbyStore: LobbyStore) {}

  async broadcastToLobby(lobbyCode: string, msg: any) {
    const lobby = await this.lobbyStore.getLobby(lobbyCode);
    this.socketBroadcaster.broadcast(
      msg,
      lobby.players.map(p => p.id)
    );
  }
}
