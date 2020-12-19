import React from 'react';
import './taboo-game.component.css';
import { useSelector } from 'react-redux';
import { selectTabooScore, selectTabooTimeLeft } from '../../../store/selectors/taboo';
import TabooGameArea from './taboo-game-area.component';
import TabooPlayerList from './taboo-player-list.component';
import GameHeader from '../../game-widgets/header/game-header';

const TabooGame = () => {
  const timeLeft = useSelector(selectTabooTimeLeft);

  return (
    <div className="game-taboo">
      <GameHeader className="game-taboo__header" timer={{ maxTime: 60, timeLeft }}>
        <TabooGameScore />
      </GameHeader>
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

export default TabooGame;
