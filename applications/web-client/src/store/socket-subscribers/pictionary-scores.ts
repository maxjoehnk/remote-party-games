import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribePictionaryScores } from '../../app/games/pictionary/pictionary-subscriptions';
import { pictionaryScores } from '../actions/pictionary';

export function pictionaryScoresSubscriber(store: Store<ApplicationState>) {
  subscribePictionaryScores(scores => {
    store.dispatch(pictionaryScores(scores));
  });
}
