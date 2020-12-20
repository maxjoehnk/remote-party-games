import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PlayerChangedEvent } from '../events/player-changed-event';
import { LobbyStore } from '../lobby-store';
import { LobbyChangedEvent } from '../events/lobby-changed-event';

@EventsHandler(PlayerChangedEvent)
export class LobbyPlayerChangedSubscriber implements IEventHandler<PlayerChangedEvent> {
  constructor(private lobbyStore: LobbyStore, private eventBus: EventBus) {}

  async handle(event: PlayerChangedEvent) {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(event.player.id);
    if (!lobbyCode) {
      return;
    }
    const lobby = await this.lobbyStore.getLobby(lobbyCode);
    const playerIndex = lobby.players.findIndex(p => p.id === event.player.id);
    lobby.players[playerIndex].name = event.player.name;
    this.eventBus.publish(new LobbyChangedEvent(lobbyCode));
  }
}
