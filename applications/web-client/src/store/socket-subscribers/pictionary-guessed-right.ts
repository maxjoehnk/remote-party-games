import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribeGuessedRight } from '../../app/games/pictionary/pictionary-subscriptions';
import { pictionaryRightGuess } from '../actions/pictionary';

export function pictionaryRightGuessSubscriber(store: Store<ApplicationState>) {
  subscribeGuessedRight(() => {
    store.dispatch(pictionaryRightGuess());
  });
}
