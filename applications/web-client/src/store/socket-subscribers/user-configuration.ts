import { subscribeUserConfiguration } from '../../app/player/player.api';
import { playerConfigurationChanged } from '../actions/player';
import { ApplicationState } from '../index';
import { Store } from 'redux';

export function userConfigurationSubscriber(store: Store<ApplicationState>) {
    subscribeUserConfiguration(configuration => {
        store.dispatch(playerConfigurationChanged(configuration));
    });
}
