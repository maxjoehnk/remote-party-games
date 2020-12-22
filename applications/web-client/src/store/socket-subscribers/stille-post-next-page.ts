import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribeNextPage } from '../../app/games/stille-post/stille-post-api';
import { stillePostNextPage } from '../actions/stille-post';

export function stillePostGameUpdateSubscriber(store: Store<ApplicationState>) {
  subscribeNextPage(state => {
    store.dispatch(stillePostNextPage(state));
  });
}
