import { StadtLandFlussGameState } from '../../../contracts/stadt-land-fluss-configuration';
import { onMessage } from '../../../socket';

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
