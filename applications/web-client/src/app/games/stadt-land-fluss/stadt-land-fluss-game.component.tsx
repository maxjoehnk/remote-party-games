import React from 'react';
import GameHeader from '../../game-widgets/header/game-header';
import i18n from 'es2015-i18n-tag';
import { useSelector } from 'react-redux';
import {
  selectCurrentStadtLandFlussLetter,
  selectStadtLandFlussRunning,
} from '../../../store/selectors/stadt-land-fluss';
import './stadt-land-fluss-game.component.css';
import { startRound, stopRound } from './stadt-land-fluss-api';
import Icon from '@mdi/react';
import Button from '../../ui-elements/button/button.component';
import { mdiCloseOctagonOutline, mdiPlay } from '@mdi/js';
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
        <span>{i18n('stadt-land-fluss')`Words starting with ${letter}`}</span>
        {running && <StopRoundButton />}
        {!running && <NextRoundButton />}
      </GameHeader>
      {running && <StadtLandFlussColumns letter={letter} />}
      {!running && <StadtLandFlussResults />}
    </div>
  );
};

const StopRoundButton = () => {
  return (
    <Button className="game-stadt-land-fluss__stop-btn" onClick={() => stopRound()}>
      <Icon
        className="game-stadt-land-fluss__stop-btn-icon"
        size="24px"
        path={mdiCloseOctagonOutline}
      />
      {i18n('stadt-land-fluss')`Stop`}
    </Button>
  );
};

const NextRoundButton = () => {
  return (
    <Button className="game-stadt-land-fluss__stop-btn" onClick={() => startRound()}>
      <Icon className="game-stadt-land-fluss__stop-btn-icon" size="24px" path={mdiPlay} />
      {i18n('stadt-land-fluss')`Next round`}
    </Button>
  );
};

export default StadtLandFlussGame;
