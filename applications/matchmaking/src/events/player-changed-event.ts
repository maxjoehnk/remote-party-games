import { Player } from '../contracts/player';

export class PlayerChangedEvent {
  constructor(public player: Player) {}
}
