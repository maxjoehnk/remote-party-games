import React from 'react';
import PlayerList from '../../matchmaking/player-list/player-list.component';
import './taboo-game.component.css';
import { useSelector } from 'react-redux';
import { selectTabooScore, selectTabooTimeLeft } from '../../../store/selectors/taboo';
import TabooGameArea from './taboo-game-area.component';
import i18n from 'es2015-i18n-tag';

const TabooGame = () => (
    <div className="game-taboo">
        <PlayerList canChangeTeam={false} className="game-taboo__player-list" />
        <TabooGameScore />
        <TabooCountdown />
        <TabooGameArea />
    </div>
);

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
