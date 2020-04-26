import React from 'react';
import './taboo-game.component.css';
import { useSelector } from 'react-redux';
import { selectTabooScore, selectTabooTimeLeft } from '../../../store/selectors/taboo';
import TabooGameArea from './taboo-game-area.component';
import i18n from 'es2015-i18n-tag';
import TabooPlayerList from './taboo-player-list.component';
import Button from '../../ui-elements/button/button.component';
import { mdiArrowLeft, mdiClockOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { stopGame } from '../../matchmaking/matchmaking.api';

const TabooGame = () => {
    return (
        <div className="game-taboo">
            <div className="game-taboo__header">
                <div className="game-taboo__lobby">
                    <Button className="game-taboo__back-btn" onClick={() => stopGame()}>
                        <Icon path={mdiArrowLeft} size={1} />
                        {i18n`Back to Lobby`}
                    </Button>
                </div>
                <TabooGameScore />
                <TabooCountdown />
                <TabooProgressBar />
            </div>
            <TabooPlayerList />
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

    return (
        <div className="game-taboo__time-left">
            <Icon path={mdiClockOutline} size={1} />
            {i18n('taboo')`${timeLeft}s left`}
        </div>
    );
};

const TabooProgressBar = () => {
    const maxTime = 60;
    const timeLeft = useSelector(selectTabooTimeLeft);
    const progress = timeLeft / maxTime;

    return (
        <div className="game-taboo__progress-bar-container">
            <div className="game-taboo__progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>
    );
};

export default TabooGame;
