import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { lobbyReducer, LobbyState } from './reducers/lobby';
import { playerReducer } from './reducers/player';
import { loadStoredState, updateStoredState } from './local-storage';
import { listenerMiddleware } from './listener';
import { socketSubscriberMiddleware } from './socket-subscribers';
import { tabooReducer } from './reducers/taboo';
import { TabooGameState } from '../contracts/taboo-game-configuration';
import { StadtLandFlussGameState } from '../contracts/stadt-land-fluss-configuration';
import { stadtLandFlussReducer } from './reducers/stadt-land-fluss';
import { PlayerModel } from '../contracts/player.model';
import { stillePostReducer, StillePostState } from './reducers/stille-post';
import { pictionaryReducer, PictionaryState } from './reducers/pictionary';

export interface ApplicationState {
  lobby: LobbyState;
  player: PlayerModel;
  taboo: TabooGameState;
  stadtLandFluss: StadtLandFlussGameState;
  stillePost: StillePostState;
  pictionary: PictionaryState;
}

const store = configureStore<ApplicationState>({
  reducer: combineReducers({
    lobby: lobbyReducer,
    player: playerReducer,
    taboo: tabooReducer,
    stadtLandFluss: stadtLandFlussReducer,
    stillePost: stillePostReducer,
    pictionary: pictionaryReducer,
  }),
  middleware: [listenerMiddleware, socketSubscriberMiddleware] as any,
});

loadStoredState(store);

store.subscribe(() => {
  const state = store.getState();
  updateStoredState(state);
});

export default store;
