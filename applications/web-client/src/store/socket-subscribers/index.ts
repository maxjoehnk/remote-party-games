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
import { pictionaryGameUpdateSubscriber } from './pictionary-game-update';
import { pictionaryChatSubscriber } from './pictionary-chat';
import { pictionaryRightGuessSubscriber } from './pictionary-guessed-right';
import { pictionaryScoresSubscriber } from './pictionary-scores';

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
  pictionaryGameUpdateSubscriber,
  pictionaryChatSubscriber,
  pictionaryRightGuessSubscriber,
  pictionaryScoresSubscriber,
];

export const socketSubscriberMiddleware = (store: Store<ApplicationState>) => {
  for (const subscriber of subscribers) {
    subscriber(store);
  }

  return next => action => {
    return next(action);
  };
};
