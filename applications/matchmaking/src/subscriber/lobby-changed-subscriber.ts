import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LobbyChangedEvent } from '../events/lobby-changed-event';
import { LobbyStore } from '../lobby-store';
import { LobbyBroadcaster } from '../sockets/lobby-broadcaster';
import { lobbyChangedSocketMsg } from '../sockets/socket-messages';

@EventsHandler(LobbyChangedEvent)
export class LobbyChangedSubscriber
  implements IEventHandler<LobbyChangedEvent> {
  constructor(
    private lobbyStore: LobbyStore,
    private lobbyBroadcaster: LobbyBroadcaster
  ) {}

  async handle(event: LobbyChangedEvent) {
    const lobby = await this.lobbyStore.getLobby(event.lobbyCode);
    if (lobby == null) {
      return;
    }
    await this.lobbyBroadcaster.broadcastToLobby(event.lobbyCode, {
      type: lobbyChangedSocketMsg,
      players: lobby.players,
      teams: lobby.teams,
    });
  }
}
