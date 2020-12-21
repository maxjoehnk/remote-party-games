import { TabooGameState } from '../../../contracts/taboo-game-configuration';
import { onMessage } from '../../../socket';

export function subscribeTabooGameUpdates(callback: (state: TabooGameState) => void) {
  return onMessage('taboo/update', msg => callback(msg.gameState));
}
