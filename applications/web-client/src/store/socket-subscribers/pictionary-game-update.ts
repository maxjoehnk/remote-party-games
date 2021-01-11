import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribePictionaryGameUpdates } from '../../app/games/pictionary/pictionary-subscriptions';
import { pictionaryGameUpdate } from '../actions/pictionary';

export function pictionaryGameUpdateSubscriber(store: Store<ApplicationState>) {
  subscribePictionaryGameUpdates(state => {
    store.dispatch(pictionaryGameUpdate(state));
  });
}
