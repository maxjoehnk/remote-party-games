import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribeBookClosed } from '../../app/games/stille-post/stille-post-api';
import { stillePostBookClosed } from '../actions/stille-post';

export function stillePostBookClosedSubscriber(store: Store<ApplicationState>) {
  subscribeBookClosed(() => {
    store.dispatch(stillePostBookClosed());
  });
}
