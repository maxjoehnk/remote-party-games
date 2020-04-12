export function LobbyPlayersChanged(players) {
    return {
        type: LobbyPlayersChanged.type,
        players
    };
}
LobbyPlayersChanged.type = 'LobbyPlayersChanged';
