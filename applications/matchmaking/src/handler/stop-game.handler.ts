import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StopGameCommand } from '../commands/stop-game.command';
import { LobbyStore } from '../lobby-store';
import { LobbyBroadcaster } from '../sockets/lobby-broadcaster';
import { gameStoppedSocketMsg } from '../sockets/socket-messages';

@CommandHandler(StopGameCommand)
export class StopGameHandler implements ICommandHandler<StopGameCommand> {
  constructor(
    private lobbyStore: LobbyStore,
    private broadcaster: LobbyBroadcaster
  ) {}

  async execute(command: StopGameCommand): Promise<any> {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(
      command.playerId
    );
    if (!lobbyCode) {
      return;
    }
    const game = await this.lobbyStore.stopGameInLobby(lobbyCode);
    await this.broadcaster.broadcastToLobby(lobbyCode, {
      type: gameStoppedSocketMsg,
      code: lobbyCode,
    });
  }
}
