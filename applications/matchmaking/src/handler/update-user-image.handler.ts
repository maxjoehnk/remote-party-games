import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUsernameCommand } from '../commands/update-username.command';
import { UpdateUserImageCommand } from '../commands/update-user-image.command';
import { LobbyStore } from '../lobby-store';
import { SocketBroadcaster } from '../sockets/socket-broadcaster';

@CommandHandler(UpdateUserImageCommand)
export class UpdateUserImageHandler implements ICommandHandler<UpdateUserImageCommand> {
  constructor(private lobbyStore: LobbyStore, private broadcaster: SocketBroadcaster) {}

  async execute(command: UpdateUsernameCommand): Promise<any> {
    const lobbyCode = await this.getLobbyCode(command);
    const playerIds = await this.getPlayerIds(lobbyCode, command);
    this.broadcastMessage(command, playerIds);
  }

  private async getLobbyCode(command: UpdateUsernameCommand) {
    const lobbyCode = await this.lobbyStore.getLobbyCodeForPlayer(command.playerId);
    return lobbyCode;
  }

  private async getPlayerIds(lobbyCode: string, command: UpdateUsernameCommand) {
    if (lobbyCode == null) {
      return [command.playerId];
    }
    const lobby = await this.lobbyStore.getLobby(lobbyCode);
    return lobby.players.map(p => p.id);
  }

  private broadcastMessage(command: UpdateUsernameCommand, playerIds: string[]) {
    this.broadcaster.broadcast(
      {
        type: 'user/image-changed',
        playerId: command.playerId,
      },
      playerIds
    );
  }
}
