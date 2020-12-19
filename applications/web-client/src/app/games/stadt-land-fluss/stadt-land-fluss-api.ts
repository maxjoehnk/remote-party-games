import { emit, onMessage } from '../../../socket';
import { StadtLandFlussGameState } from '../../../contracts/stadt-land-fluss-configuration';

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

export function subscribeStadtLandFlussGameUpdates(
  callback: (state: StadtLandFlussGameState) => void
) {
  const startSubscription = onMessage('stadt-land-fluss/round-started', msg =>
    callback(msg.gameState)
  );
  const finishSubscription = onMessage('stadt-land-fluss/round-finished', msg =>
    callback(msg.gameState)
  );
  const scoreSubscription = onMessage('stadt-land-fluss/score-updated', msg =>
    callback(msg.gameState)
  );

  return {
    unsubscribe: () => {
      startSubscription.unsubscribe();
      finishSubscription.unsubscribe();
      scoreSubscription.unsubscribe();
    },
  };
}
