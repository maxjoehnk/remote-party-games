import { subscribeUserConfiguration } from '../../app/player/player.api';
import { playerConfigurationChanged } from '../actions/player';

export function userConfigurationSubscriber(dispatch: (action) => void) {
    subscribeUserConfiguration(configuration => {
        dispatch(playerConfigurationChanged(configuration));
    });
}
