import { ApplicationState } from './index';
import { PlayerState } from './reducers/player';
import { updatePlayerName } from './actions/player';

function getStoredPlayer(): PlayerState | null {
    const serializedPlayerState = localStorage.getItem('player');
    const playerState: PlayerState = serializedPlayerState ? JSON.parse(serializedPlayerState) : null;

    return playerState;
}

export const updateStoredState = (state: ApplicationState) => {
    localStorage.setItem('player', JSON.stringify(state.player));
};

export const loadStoredState = store => {
    const player = getStoredPlayer();
    if (player != null) {
        store.dispatch(updatePlayerName(player.name));
    }
}