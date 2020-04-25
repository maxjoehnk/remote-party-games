import { TabooGameState } from '../../../contracts/taboo-game-configuration';
import { emit, onMessage } from '../../../socket';

export function rightGuess() {
    emit({
        type: 'game/action',
        actionType: 'taboo/guess'
    });
}

export function skipCard() {
    emit({
        type: 'game/action',
        actionType: 'taboo/skip'
    });
}

export function continueGame() {
    emit({
        type: 'game/action',
        actionType: 'taboo/continue'
    });
}

export function subscribeTabooGameUpdates(callback: (state: TabooGameState) => void) {
    return onMessage('taboo/update', msg => callback(msg.gameState));
}