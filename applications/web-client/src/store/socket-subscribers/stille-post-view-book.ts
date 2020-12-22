import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribeViewBook } from '../../app/games/stille-post/stille-post-api';
import { stillePostViewBook } from '../actions/stille-post';

export function stillePostViewBookSubscriber(store: Store<ApplicationState>) {
  subscribeViewBook(msg => {
    store.dispatch(stillePostViewBook(msg));
  });
}
