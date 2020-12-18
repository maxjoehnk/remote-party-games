import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SwitchTeamCommand } from '../commands/switch-team.command';
import { LobbyStore } from '../lobby-store';
import { PlayerStore } from '../player-store';
import { LobbyChangedEvent } from '../events/lobby-changed-event';

@CommandHandler(SwitchTeamCommand)
export class SwitchTeamHandler implements ICommandHandler<SwitchTeamCommand> {
  constructor(
    private lobbyStore: LobbyStore,
    private playerStore: PlayerStore,
    private eventBus: EventBus
  ) {}

  async execute(command: SwitchTeamCommand): Promise<any> {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(
      command.playerId
    );
    if (lobbyCode == null) {
      return;
    }
    const player = await this.playerStore.getPlayer(command.playerId);
    await this.lobbyStore.switchTeam(lobbyCode, player, command.teamId);
    this.eventBus.publish(new LobbyChangedEvent(lobbyCode));
  }
}
