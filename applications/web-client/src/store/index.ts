import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { lobbyReducer, LobbyState } from './reducers/lobby';
import { playerReducer, PlayerState } from './reducers/player';
import { loadStoredState, updateStoredState } from './local-storage';
import { listenerMiddleware } from './listener';
import { socketSubscriberMiddleware } from './socket-subscribers';
import { tabooReducer } from './reducers/taboo';
import { TabooGameState } from '../contracts/taboo-game-configuration';

export interface ApplicationState {
    lobby: LobbyState;
    player: PlayerState;
    taboo: TabooGameState;
}

const store = configureStore<ApplicationState>({
    reducer: combineReducers({
        lobby: lobbyReducer,
        player: playerReducer,
        taboo: tabooReducer
    }),
    middleware: [listenerMiddleware, socketSubscriberMiddleware] as any
});

loadStoredState(store);

store.subscribe(() => {
    const state = store.getState();
    updateStoredState(state);
})

export default store;