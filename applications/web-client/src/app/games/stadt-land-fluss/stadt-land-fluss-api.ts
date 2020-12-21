import { emit } from '../../../socket';

export function submitWord(column: number, word: string) {
  emit({
    type: 'game/action',
    actionType: 'stadt-land-fluss/submit-word',
    column,
    value: word,
  });
}

export function startRound() {
  emit({
    type: 'game/action',
    actionType: 'stadt-land-fluss/start-round',
  });
}

export function stopRound() {
  emit({
    type: 'game/action',
    actionType: 'stadt-land-fluss/stop-round',
  });
}

export function denyWord(playerId: string, column: number) {
  emit({
    type: 'game/action',
    actionType: 'stadt-land-fluss/deny-word',
    playerId,
    column,
  });
}

export function upvoteWord(playerId: string, column: number) {
  emit({
    type: 'game/action',
    actionType: 'stadt-land-fluss/upvote-word',
    playerId,
    column,
  });
}
