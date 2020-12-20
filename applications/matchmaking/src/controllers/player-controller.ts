import { Controller, HttpCode, Param, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserImageCommand } from '../commands/update-user-image.command';

@Controller('/api/player')
export class PlayerController {
  constructor(private commandBus: CommandBus) {}

  @Put(':playerId/image')
  @HttpCode(204)
  async updatePlayerImage(@Param('playerId') playerId: string) {
    await this.commandBus.execute(new UpdateUserImageCommand(playerId));
  }
}
