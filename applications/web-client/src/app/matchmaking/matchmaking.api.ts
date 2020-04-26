import { emit, onMessage } from '../../socket';
import { PlayerModel } from '../../contracts/player.model';
import { TabooGameConfiguration, TabooGameState } from '../../contracts/taboo-game-configuration';
import { TeamModel } from '../../contracts/team.model';

export interface CreateLobbyResponse {
    code: string;
    players: PlayerModel[];
    teams: TeamModel[];
}

export interface LobbyChangedMessage {
    type: 'lobby/lobby-changed';
    players: PlayerModel[];
    teams: TeamModel[];
}

export interface GameStartedMessage {
    type: 'lobby/game-start';
    game: 'taboo';
    gameState: TabooGameState;
}

export interface GameConfigurationChangedMessage {
    type: 'lobby/game-configuration-changed';
    game: 'taboo';
    gameConfiguration: TabooGameConfiguration;
}

export async function createLobby(): Promise<CreateLobbyResponse> {
    const res = await fetch('/api/lobby', {
        method: 'POST'
    });
    return await res.json();
}

export async function getLobby(code) {
    const res = await fetch(`/api/lobby/${code}`);
    return await res.json();
}

export function joinLobby(code) {
    emit({
        type: 'lobby/join',
        code
    });
}

export function startGame() {
    emit({
        type: 'lobby/start-game'
    });
}

export function updateGameConfiguration(configuration: TabooGameConfiguration) {
    emit({
        type: 'lobby/update-game-config',
        configuration
    });
}

export function switchTeam(teamId: string) {
    emit({
        type: 'lobby/switch-team',
        teamId
    });
}

export function subscribeLobbyChanges(callback: (msg: LobbyChangedMessage) => void) {
    return onMessage('lobby/lobby-changed', callback);
}

export function subscribeLobbyClosed(callback: (msg: LobbyChangedMessage) => void) {
    return onMessage('lobby/closed', callback);
}

export function subscribeGameStarted(callback: (msg: GameStartedMessage) => void) {
    return onMessage('lobby/game-started', callback);
}

export function subscribeGameConfigurationChanged(
    callback: (msg: GameConfigurationChangedMessage) => void
) {
    return onMessage('lobby/game-configuration-changed', callback);
}
