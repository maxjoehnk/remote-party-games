import { onMessage } from '../../../socket';
import { PictionaryRoundState } from '../../../store/reducers/pictionary';

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
