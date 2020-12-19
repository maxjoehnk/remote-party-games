import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ChangeGameCommand } from '../commands/change-game.command';
import { LobbyStore } from '../lobby-store';
import { LobbyChangedEvent } from '../events/lobby-changed-event';

@CommandHandler(ChangeGameCommand)
export class ChangeGameHandler implements ICommandHandler<ChangeGameCommand> {
  constructor(private lobbyStore: LobbyStore, private eventBus: EventBus) {}

  async execute(command: ChangeGameCommand): Promise<any> {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(command.playerId);
    if (lobbyCode == null) {
      return;
    }
    await this.lobbyStore.changeLobbyGameType(lobbyCode, command.game);
    this.eventBus.publish(new LobbyChangedEvent(lobbyCode));
  }
}
