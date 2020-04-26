import { updateLobbySubscriber } from './update-lobby';
import { lobbyClosedSubscriber } from './lobby-closed';
import { userConfigurationSubscriber } from './user-configuration';
import { tabooGameUpdateSubscriber } from './taboo-game-update';
import { socketClosedSubscriber } from './socket-closed';
import { socketOpenedSubscriber } from './socket-opened';
import { ApplicationState } from '../index';
import { Store } from 'redux';

type Subscriber = (store: Store<ApplicationState>) => void;

const subscribers: Subscriber[] = [
    updateLobbySubscriber,
    lobbyClosedSubscriber,
    userConfigurationSubscriber,
    tabooGameUpdateSubscriber,
    socketClosedSubscriber,
    socketOpenedSubscriber
];

export const socketSubscriberMiddleware = (store: Store<ApplicationState>) => {
    for (const subscriber of subscribers) {
        subscriber(store);
    }

    return next => action => {
        return next(action);
    };
};
