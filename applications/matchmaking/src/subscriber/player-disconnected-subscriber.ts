import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PlayerDisconnectedEvent } from '../events/player-disconnected-event';
import { LobbyStore } from '../lobby-store';
import { PlayerStore } from '../player-store';
import { LobbyChangedEvent } from '../events/lobby-changed-event';

@EventsHandler(PlayerDisconnectedEvent)
export class PlayerDisconnectedSubscriber implements IEventHandler<PlayerDisconnectedEvent> {
  constructor(
    private lobbyStore: LobbyStore,
    private playerStore: PlayerStore,
    private eventBus: EventBus
  ) {}

  async handle(event: PlayerDisconnectedEvent) {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(event.playerId);
    if (lobbyCode == null) {
      return;
    }
    const player = await this.playerStore.getPlayer(event.playerId);
    await this.lobbyStore.leaveLobby(player, lobbyCode);
    this.eventBus.publish(new LobbyChangedEvent(lobbyCode));
  }
}
