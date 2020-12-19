import { GameTypes } from '../games/types';

export class ChangeGameCommand {
  constructor(public playerId: string, public game: GameTypes) {}
}
