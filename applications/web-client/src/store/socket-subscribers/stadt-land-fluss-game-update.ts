import { ApplicationState } from '../index';
import { Store } from 'redux';
import { subscribeStadtLandFlussGameUpdates } from '../../app/games/stadt-land-fluss/stadt-land-fluss-api';
import { stadtLandFlussGameUpdate } from '../actions/stadt-land-fluss';

export function stadtLandFlussGameUpdateSubscriber(store: Store<ApplicationState>) {
    subscribeStadtLandFlussGameUpdates(state => {
        store.dispatch(stadtLandFlussGameUpdate(state));
    });
}
