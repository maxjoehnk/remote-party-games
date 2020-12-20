import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUsernameCommand } from '../commands/update-username.command';
import { PlayerStore } from '../player-store';
import { PlayerChangedEvent } from '../events/player-changed-event';
import { Player } from '../contracts/player';

@CommandHandler(UpdateUsernameCommand)
export class UpdateUsernameHandler implements ICommandHandler<UpdateUsernameCommand> {
  constructor(private playerStore: PlayerStore, private eventBus: EventBus) {}

  async execute(command: UpdateUsernameCommand): Promise<any> {
    await this.playerStore.setPlayer(command.playerId, command.name);
    const player: Player = { id: command.playerId, name: command.name };
    this.eventBus.publish(new PlayerChangedEvent(player));
  }
}
