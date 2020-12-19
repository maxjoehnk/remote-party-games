import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ChangeGameConfigurationCommand } from '../commands/change-game-configuration.command';
import { LobbyStore } from '../lobby-store';
import { LobbyChangedEvent } from '../events/lobby-changed-event';

@CommandHandler(ChangeGameConfigurationCommand)
export class ChangeGameConfigurationHandler
  implements ICommandHandler<ChangeGameConfigurationCommand> {
  constructor(private lobbyStore: LobbyStore, private eventBus: EventBus) {}

  async execute(command: ChangeGameConfigurationCommand): Promise<any> {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(
      command.playerId
    );
    if (lobbyCode == null) {
      return;
    }
    await this.lobbyStore.updateGameConfiguration(lobbyCode, command.config);
    this.eventBus.publish(new LobbyChangedEvent(lobbyCode));
  }
}
