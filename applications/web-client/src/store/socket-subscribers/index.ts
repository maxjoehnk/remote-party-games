import { updateLobbySubscriber } from './update-lobby';
import { lobbyClosedSubscriber } from './lobby-closed';
import { tabooGameUpdateSubscriber } from './taboo-game-update';
import { socketClosedSubscriber } from './socket-closed';
import { socketOpenedSubscriber } from './socket-opened';
import { stadtLandFlussGameUpdateSubscriber } from './stadt-land-fluss-game-update';
import { ApplicationState } from '../index';
import { Store } from 'redux';
import { gameStoppedSubscriber } from './game-stopped';

type Subscriber = (store: Store<ApplicationState>) => void;

const subscribers: Subscriber[] = [
    updateLobbySubscriber,
    lobbyClosedSubscriber,
    tabooGameUpdateSubscriber,
    stadtLandFlussGameUpdateSubscriber,
    socketClosedSubscriber,
    socketOpenedSubscriber,
    gameStoppedSubscriber,
];

export const socketSubscriberMiddleware = (store: Store<ApplicationState>) => {
    for (const subscriber of subscribers) {
        subscriber(store);
    }

    return next => action => {
        return next(action);
    };
};
