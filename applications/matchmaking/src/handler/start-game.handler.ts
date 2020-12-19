import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StartGameCommand } from '../commands/start-game.command';
import { LobbyStore } from '../lobby-store';
import { LobbyBroadcaster } from '../sockets/lobby-broadcaster';
import { gameStartedSocketMsg } from '../sockets/socket-messages';

@CommandHandler(StartGameCommand)
export class StartGameHandler implements ICommandHandler<StartGameCommand> {
  constructor(private lobbyStore: LobbyStore, private broadcaster: LobbyBroadcaster) {}

  async execute(command: StartGameCommand): Promise<any> {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(command.playerId);
    if (!lobbyCode) {
      return;
    }
    const game = await this.lobbyStore.startGameInLobby(lobbyCode);
    await this.broadcaster.broadcastToLobby(lobbyCode, {
      type: gameStartedSocketMsg,
      game: game.type,
      gameState: game.state,
    });
  }
}
