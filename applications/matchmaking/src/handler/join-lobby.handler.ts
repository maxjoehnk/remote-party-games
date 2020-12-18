import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { JoinLobbyCommand } from '../commands/join-lobby.command';
import { LobbyStore } from '../lobby-store';
import { LobbyChangedEvent } from '../events/lobby-changed-event';
import { Game } from '../contracts/game';
import { PlayerStore } from '../player-store';

@CommandHandler(JoinLobbyCommand)
export class JoinLobbyHandler implements ICommandHandler<JoinLobbyCommand> {
  constructor(
    private lobbyStore: LobbyStore,
    private playerStore: PlayerStore,
    private eventBus: EventBus
  ) {}

  async execute(command: JoinLobbyCommand): Promise<Game | null> {
    const current = await this.lobbyStore.getLobbyCodeForPlayer(
      command.playerId
    );
    if (current === command.lobbyCode) {
      return;
    }
    const player = await this.playerStore.getPlayer(command.playerId);
    if (current != null) {
      await this.lobbyStore.leaveLobby(player, current);
      this.eventBus.publish(new LobbyChangedEvent(current));
    }
    const game = await this.lobbyStore.joinLobby(player, command.lobbyCode);
    this.eventBus.publish(new LobbyChangedEvent(command.lobbyCode));
    return game;
  }
}
