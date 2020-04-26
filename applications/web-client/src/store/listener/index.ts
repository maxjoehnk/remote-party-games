import { joinLobbyListener } from './join-lobby';
import { updateUsernameListener } from './update-username';

const listeners = [joinLobbyListener, updateUsernameListener];

export const listenerMiddleware = store => next => action => {
    const state = next(action);
    for (const listener of listeners) {
        listener(state, action);
    }
    return state;
};
