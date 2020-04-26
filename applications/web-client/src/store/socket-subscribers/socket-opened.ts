import { onSocketOpen } from '../../socket';
import { ApplicationState } from '../index';
import { Store } from 'redux';
import { updateUsername } from '../../app/player/player.api';

export function socketOpenedSubscriber(store: Store<ApplicationState>) {
    onSocketOpen(() => {
        const state = store.getState();
        if (state.player.name != null) {
            updateUsername(state.player.name);
        }
    });
}
