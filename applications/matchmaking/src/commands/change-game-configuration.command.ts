import { GameConfiguration } from '../games/config';

export class ChangeGameConfigurationCommand {
  constructor(public playerId: string, public config: GameConfiguration) {}
}
