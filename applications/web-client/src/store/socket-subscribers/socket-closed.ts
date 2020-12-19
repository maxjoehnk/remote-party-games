import { leaveLobby } from '../actions/lobby';
import { onSocketClose } from '../../socket';
import { ApplicationState } from '../index';
import { Store } from 'redux';

export function socketClosedSubscriber(store: Store<ApplicationState>) {
  onSocketClose(() => store.dispatch(leaveLobby()));
}
