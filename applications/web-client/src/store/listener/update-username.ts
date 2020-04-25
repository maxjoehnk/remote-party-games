import * as playerApi from '../../app/player/player.api';
import { updatePlayerName } from '../actions/player';

export function updateUsernameListener(state, action) {
    if (action.type !== updatePlayerName.type) {
        return;
    }
    playerApi.updateUsername(action.payload);
}