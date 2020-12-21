import { ApplicationState } from '../index';
import { Store } from 'redux';
import { stadtLandFlussGameUpdate } from '../actions/stadt-land-fluss';
import { subscribeStadtLandFlussGameUpdates } from '../../app/games/stadt-land-fluss/stadt-land-fluss-subscriptions';

export function stadtLandFlussGameUpdateSubscriber(store: Store<ApplicationState>) {
  subscribeStadtLandFlussGameUpdates(state => {
    store.dispatch(stadtLandFlussGameUpdate(state));
  });
}
