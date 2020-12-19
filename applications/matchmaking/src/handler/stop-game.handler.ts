import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { StopGameCommand } from '../commands/stop-game.command';
import { LobbyStore } from '../lobby-store';
import { LobbyBroadcaster } from '../sockets/lobby-broadcaster';
import { gameStoppedSocketMsg } from '../sockets/socket-messages';
import { LobbyChangedEvent } from '../events/lobby-changed-event';

@CommandHandler(StopGameCommand)
export class StopGameHandler implements ICommandHandler<StopGameCommand> {
  constructor(
    private lobbyStore: LobbyStore,
    private broadcaster: LobbyBroadcaster,
    private eventBus: EventBus
  ) {}

  async execute(command: StopGameCommand): Promise<any> {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(command.playerId);
    if (!lobbyCode) {
      return;
    }
    await this.lobbyStore.stopGameInLobby(lobbyCode);
    await this.broadcaster.broadcastToLobby(lobbyCode, {
      type: gameStoppedSocketMsg,
      code: lobbyCode,
    });
    this.eventBus.publish(new LobbyChangedEvent(lobbyCode));
  }
}
