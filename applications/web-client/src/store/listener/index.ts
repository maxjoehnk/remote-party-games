import { joinLobbyListener } from './join-lobby';
import { updateUsernameListener } from './update-username';
import { ApplicationState } from '../index';
import { stillePostFinishPageListener } from './stille-post-finish-page';

type ActionListener = (state: ApplicationState, action, previousState?: ApplicationState) => void;

const listeners: ActionListener[] = [
  joinLobbyListener,
  updateUsernameListener,
  stillePostFinishPageListener,
];

export const listenerMiddleware = store => next => action => {
  const previous = store.getState();
  const state = next(action);
  for (const listener of listeners) {
    listener(state, action, previous);
  }
  return state;
};
