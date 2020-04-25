import { subscribeTabooGameUpdates } from '../../app/games/taboo/taboo-api';
import { tabooGameUpdate } from '../actions/taboo';

export function tabooGameUpdateSubscriber(dispatch: (action) => void) {
    subscribeTabooGameUpdates(state => {
        dispatch(tabooGameUpdate(state));
    });
}
