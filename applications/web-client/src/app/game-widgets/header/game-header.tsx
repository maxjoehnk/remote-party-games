import Button from '../../ui-elements/button/button.component';
import { stopGame } from '../../matchmaking/matchmaking.api';
import Icon from '@mdi/react';
import { mdiArrowLeft, mdiClockOutline } from '@mdi/js';
import i18n from 'es2015-i18n-tag';
import React from 'react';
import './game-header.css';

export interface GameHeaderProps {
  timer?: Timer;
  children: any;
  className?: string;
  contentClass?: string;
}

export interface Timer {
  timeLeft: number;
  maxTime: number;
}

const GameHeader = ({ timer, children, className, contentClass }: GameHeaderProps) => {
  const hasTimer = timer != null;

  return (
    <div className={`game-header ${hasTimer && 'game-header--timer'} ${className}`}>
      <div className="game-header__lobby">
        <Button className="game-header__back-btn" onClick={() => stopGame()}>
          <Icon path={mdiArrowLeft} size={1} />
          {i18n`Back to Lobby`}
        </Button>
      </div>
      <div className={`game-header__content ${contentClass}`}>{children}</div>
      {hasTimer && <Countdown timeLeft={timer.timeLeft} />}
      {hasTimer && <ProgressBar timer={timer} />}
    </div>
  );
};

const Countdown = ({ timeLeft }) => {
  const formattedTime = formatTime(timeLeft);

  return (
    <div className="game-header__time-left">
      <Icon path={mdiClockOutline} size={1} />
      <span className="game-header__time-left-text">{i18n`${formattedTime} left`}</span>
    </div>
  );
};

const formatTime = (time: number): string => {
  if (time <= 60) {
    return i18n`${time}s`;
  }
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const ProgressBar = ({ timer }: { timer: Timer }) => {
  const progress = timer.timeLeft / timer.maxTime;

  return (
    <div className="game-header__progress-bar-container">
      <div className="game-header__progress-bar" style={{ width: `${progress * 100}%` }} />
    </div>
  );
};

export default GameHeader;
