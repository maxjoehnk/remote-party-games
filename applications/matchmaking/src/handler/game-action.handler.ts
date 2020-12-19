import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameActionCommand } from '../commands/game-action.command';
import { LobbyStore } from '../lobby-store';

@CommandHandler(GameActionCommand)
export class GameActionHandler implements ICommandHandler<GameActionCommand> {
  constructor(private lobbyStore: LobbyStore) {}

  async execute(command: GameActionCommand) {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(
      command.playerId
    );
    if (!lobbyCode) {
      return;
    }
    const game = await this.lobbyStore.getGameForLobby(lobbyCode);
    if (game == null) {
      return;
    }
    await game.execute(command.action, command.playerId);
  }
}
