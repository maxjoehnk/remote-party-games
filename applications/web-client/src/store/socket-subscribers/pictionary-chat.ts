import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribeChat } from '../../app/games/pictionary/pictionary-subscriptions';
import { pictionaryChat } from '../actions/pictionary';

export function pictionaryChatSubscriber(store: Store<ApplicationState>) {
  subscribeChat(state => {
    store.dispatch(pictionaryChat(state));
  });
}
