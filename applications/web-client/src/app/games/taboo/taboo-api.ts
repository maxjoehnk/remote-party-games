import { emit } from '../../../socket';

export function rightGuess() {
  emit({
    type: 'game/action',
    actionType: 'taboo/guess',
  });
}

export function skipCard() {
  emit({
    type: 'game/action',
    actionType: 'taboo/skip',
  });
}

export function continueGame() {
  emit({
    type: 'game/action',
    actionType: 'taboo/continue',
  });
}

export function skippedPastCard(term: string) {
  emit({
    type: 'game/action',
    actionType: 'taboo/skip-past',
    term,
  });
}

export function guessedPastCard(term: string) {
  emit({
    type: 'game/action',
    actionType: 'taboo/guess-past',
    term,
  });
}
