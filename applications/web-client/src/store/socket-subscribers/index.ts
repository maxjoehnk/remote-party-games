import { updateLobbySubscriber } from './update-lobby';
import { lobbyClosedSubscriber } from './lobby-closed';
import { tabooGameUpdateSubscriber } from './taboo-game-update';
import { socketClosedSubscriber } from './socket-closed';
import { socketOpenedSubscriber } from './socket-opened';
import { stadtLandFlussGameUpdateSubscriber } from './stadt-land-fluss-game-update';
import { gameStoppedSubscriber } from './game-stopped';
import { stillePostGameUpdateSubscriber } from './stille-post-next-page';
import { stillePostBooksReadySubscriber } from './stille-post-books-ready';
import { stillePostViewBookSubscriber } from './stille-post-view-book';
import { stillePostBookClosedSubscriber } from './stille-post-book-closed';
import { ApplicationState } from '../index';
import { Store } from 'redux';

type Subscriber = (store: Store<ApplicationState>) => void;

const subscribers: Subscriber[] = [
  updateLobbySubscriber,
  lobbyClosedSubscriber,
  tabooGameUpdateSubscriber,
  stadtLandFlussGameUpdateSubscriber,
  socketClosedSubscriber,
  socketOpenedSubscriber,
  gameStoppedSubscriber,
  stillePostGameUpdateSubscriber,
  stillePostBooksReadySubscriber,
  stillePostViewBookSubscriber,
  stillePostBookClosedSubscriber,
];

export const socketSubscriberMiddleware = (store: Store<ApplicationState>) => {
  for (const subscriber of subscribers) {
    subscriber(store);
  }

  return next => action => {
    return next(action);
  };
};
