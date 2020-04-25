import * as lobbyPlayersChanged from './lobby-changed.js';
import * as playerDisconnect from './player-disconnect.js';

export function setupSubscribers() {
    lobbyPlayersChanged.setup();
    playerDisconnect.setup();
}
