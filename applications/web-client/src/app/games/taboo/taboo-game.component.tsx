import React from 'react';
import PlayerList from '../../matchmaking/player-list/player-list.component';
import './taboo-game.component.css';
import { useSelector } from 'react-redux';
import {
    selectTabooCurrentRound,
    selectTabooScore,
    selectTabooTimeLeft
} from '../../../store/selectors/taboo';
import TabooGameArea from './taboo-game-area.component';
import i18n from 'es2015-i18n-tag';
import { selectTeams } from '../../../store/selectors/lobby';
import Icon from '@mdi/react';
import { mdiAccountAlert, mdiAccountQuestion, mdiEye } from '@mdi/js';

const TabooGame = () => {
    const currentRound = useSelector(selectTabooCurrentRound);
    const teams = useSelector(selectTeams);
    const activeTeam = teams[currentRound.team - 1];

    return (
        <div className="game-taboo">
            <PlayerList canChangeTeam={false} className="game-taboo__player-list">
                {(text, player, team) => {
                    const isPlayingTeam = activeTeam.id === team.id;
                    const isExplainingPlayer = player.id === currentRound.activePlayer;

                    if (isExplainingPlayer) {
                        return (
                            <span className="game-taboo__player game-taboo__player--explaining">
                                <span className="game-taboo__player-name">{text}</span>
                                <Icon
                                    path={mdiAccountAlert}
                                    size={1}
                                    className="game-taboo__player-icon"
                                />
                            </span>
                        );
                    }
                    if (isPlayingTeam) {
                        return (
                            <span className="game-taboo__player game-taboo__player--guessing">
                                <span className="game-taboo__player-name">{text}</span>
                                <Icon
                                    path={mdiAccountQuestion}
                                    size={1}
                                    className="game-taboo__player-icon"
                                />
                            </span>
                        );
                    }
                    return (
                        <span className="game-taboo__player game-taboo__player--observing">
                            <span className="game-taboo__player-name">{text}</span>
                            <Icon path={mdiEye} size={1} className="game-taboo__player-icon" />
                        </span>
                    );
                }}
            </PlayerList>
            <TabooGameScore />
            <TabooCountdown />
            <TabooGameArea />
        </div>
    );
};

const TabooGameScore = () => {
    const [teamOne, teamTwo] = useSelector(selectTabooScore);

    return (
        <div className="game-taboo__score">
            {teamOne}:{teamTwo}
        </div>
    );
};

const TabooCountdown = () => {
    const timeLeft = useSelector(selectTabooTimeLeft);

    return <div className="game-taboo__time-left">{i18n('taboo')`${timeLeft}s left`}</div>;
};

export default TabooGame;
