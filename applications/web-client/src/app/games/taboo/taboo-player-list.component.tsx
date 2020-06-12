import { mdiAccountAlert, mdiAccountQuestion, mdiEye } from '@mdi/js';
import PlayerList from '../../matchmaking/player-list/player-list.component';
import Icon from '@mdi/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectTabooCurrentRound } from '../../../store/selectors/taboo';
import { selectTeams } from '../../../store/selectors/lobby';

const TabooPlayerList = () => {
    const currentRound = useSelector(selectTabooCurrentRound);
    const teams = useSelector(selectTeams);
    const activeTeam = teams[currentRound.team - 1];

    return (
        <PlayerList canChangeTeam={false} className="game-taboo__player-list">
            {(text, player, team) => {
                const isExplainingPlayer = player.id === currentRound.activePlayer;
                const isPlayingTeam = activeTeam.id === team.id;

                const icon = getPlayerIcon(isExplainingPlayer, isPlayingTeam);
                const className = getPlayerClassName(isExplainingPlayer, isPlayingTeam);

                return (
                    <span className={`game-taboo__player ${className}`} key={player.id}>
                        <span className="game-taboo__player-name">{text}</span>
                        <Icon path={icon} size={1} className="game-taboo__player-icon" />
                    </span>
                );
            }}
        </PlayerList>
    );
};

function getPlayerIcon(isExplainingPlayer: boolean, isPlayingTeam: boolean) {
    if (isExplainingPlayer) {
        return mdiAccountAlert;
    }
    if (isPlayingTeam) {
        return mdiAccountQuestion;
    }
    return mdiEye;
}

function getPlayerClassName(isExplainingPlayer: boolean, isPlayingTeam: boolean): string {
    if (isExplainingPlayer) {
        return 'game-taboo__player--explaining';
    }
    if (isPlayingTeam) {
        return 'game-taboo__player--guessing';
    }
    return 'game-taboo__player--observing';
}

export default TabooPlayerList;
