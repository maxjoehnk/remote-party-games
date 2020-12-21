import React from 'react';
import GameHeader from '../../game-widgets/header/game-header';
import i18n from 'es2015-i18n-tag';
import { useSelector } from 'react-redux';
import {
  selectCurrentStadtLandFlussLetter,
  selectStadtLandFlussRunning,
} from '../../../store/selectors/stadt-land-fluss';
import './stadt-land-fluss-game.component.css';
import StadtLandFlussColumns from './stadt-land-fluss-columns.component';
import StadtLandFlussResults from './stadt-land-fluss-results.component';

const StadtLandFlussGame = () => {
  const letter = useSelector(selectCurrentStadtLandFlussLetter);
  const running = useSelector(selectStadtLandFlussRunning);

  return (
    <div className="game-stadt-land-fluss">
      <GameHeader
        className="game-stadt-land-fluss__header"
        contentClass="game-stadt-land-fluss__header-content"
      >
        {i18n('stadt-land-fluss')`Words starting with ${letter}`}
      </GameHeader>
      {running && <StadtLandFlussColumns letter={letter} />}
      {!running && <StadtLandFlussResults />}
    </div>
  );
};

export default StadtLandFlussGame;
