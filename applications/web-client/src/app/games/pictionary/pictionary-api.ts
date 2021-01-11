import { emit } from '../../../socket';
import { DrawingAction } from '../../game-widgets/drawing/drawing-context';

export function selectWord(word: string) {
  emit({
    type: 'game/action',
    actionType: 'pictionary/select-word',
    word,
  });
}

export function draw(actions: DrawingAction[]) {
  emit({
    type: 'game/action',
    actionType: 'pictionary/draw',
    actions,
  });
}

export function guess(message: string) {
  emit({
    type: 'game/action',
    actionType: 'pictionary/guess',
    message,
  });
}

export function nextRound() {
  emit({
    type: 'game/action',
    actionType: 'pictionary/continue',
  });
}
