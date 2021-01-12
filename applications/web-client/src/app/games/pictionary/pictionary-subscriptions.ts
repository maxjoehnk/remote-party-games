import { onMessage } from '../../../socket';
import { PictionaryRoundState, PlayerRanking } from '../../../store/reducers/pictionary';
import { DrawingAction } from '../../game-widgets/drawing/drawing-context';

export interface PictionaryChatMessage {
  type: 'pictionary/chat';
  player: string;
  message: string;
}

export function subscribePictionaryGameUpdates(callback: (state: PictionaryRoundState) => void) {
  return onMessage('pictionary/update', msg => callback(msg.state));
}

export function subscribeChat(callback: (msg: PictionaryChatMessage) => void) {
  return onMessage('pictionary/chat', callback);
}

export function subscribeGuessedRight(callback: () => void) {
  return onMessage('pictionary/guessed-right', callback);
}

export function subscribePictionaryImageUpdate(callback: (actions: DrawingAction[]) => void) {
  return onMessage('pictionary/image-update', msg => callback(msg.drawing));
}

export function subscribePictionaryScores(callback: (rankings: PlayerRanking[]) => void) {
  return onMessage('pictionary/scores', msg => callback(msg.scores));
}
