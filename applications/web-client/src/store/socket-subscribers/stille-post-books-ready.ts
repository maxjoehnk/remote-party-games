import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribeBooksFinished } from '../../app/games/stille-post/stille-post-api';
import { stillePostAllBooksReady } from '../actions/stille-post';

export function stillePostBooksReadySubscriber(store: Store<ApplicationState>) {
  subscribeBooksFinished(books => {
    store.dispatch(stillePostAllBooksReady(books));
  });
}
