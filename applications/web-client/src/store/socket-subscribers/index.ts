import { updateLobbySubscriber } from './update-lobby';
import { lobbyClosedSubscriber } from './lobby-closed';
import { userConfigurationSubscriber } from './user-configuration';
import { tabooGameUpdateSubscriber } from './taboo-game-update';

const subscribers = [updateLobbySubscriber, lobbyClosedSubscriber, userConfigurationSubscriber, tabooGameUpdateSubscriber];

export const socketSubscriberMiddleware = store => {
    for (const subscriber of subscribers) {
        subscriber(action => store.dispatch(action));
    }

    return next => action => {
        return next(action);
    };
};