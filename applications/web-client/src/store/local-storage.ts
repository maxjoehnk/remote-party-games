import { ApplicationState } from './index';
import { loadPlayer } from './actions/player';
import { getUser, storeUser } from '../user-store';

export const updateStoredState = (state: ApplicationState) => {
  storeUser(state.player);
};

export const loadStoredState = store => {
  const player = getUser();
  if (player != null) {
    store.dispatch(loadPlayer(player));
  }
};
