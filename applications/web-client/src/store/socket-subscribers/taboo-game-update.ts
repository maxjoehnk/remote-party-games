import { subscribeTabooGameUpdates } from '../../app/games/taboo/taboo-api';
import { tabooGameUpdate } from '../actions/taboo';
import { ApplicationState } from '../index';
import { Store } from 'redux';

export function tabooGameUpdateSubscriber(store: Store<ApplicationState>) {
  subscribeTabooGameUpdates(state => {
    store.dispatch(tabooGameUpdate(state));
  });
}
