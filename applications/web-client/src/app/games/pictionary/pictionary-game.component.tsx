import React from 'react';
import GameHeader from '../../game-widgets/header/game-header';
import './pictionary-game.component.css';
import { useSelector } from 'react-redux';
import {
  selectPictionaryCurrentRound,
  selectPictionaryTimeLeft,
  selectPictionaryWordToDraw,
} from '../../../store/selectors/pictionary';
import { selectGameConfig } from '../../../store/selectors/lobby';
import { PictionaryConfiguration } from '../../../contracts/pictionary-configuration';
import PictionaryPlayerList from './pictionary-player-list.component';
import PictionaryGameArea from './pictionary-game-area.component';
import PictionaryChat from './chat.component';

const PictionaryGame = () => {
  const timeLeft = useSelector(selectPictionaryTimeLeft);
  const config: PictionaryConfiguration = useSelector(selectGameConfig);

  return (
    <div className="game-pictionary">
      <GameHeader className="game-pictionary__header" timer={{ maxTime: config.timer, timeLeft }}>
        <PictionaryWordDisplay />
      </GameHeader>
      <PictionaryPlayerList />
      <PictionaryGameArea />
      <PictionaryChat />
    </div>
  );
};

const PictionaryWordDisplay = () => {
  const currentRound = useSelector(selectPictionaryCurrentRound);

  if (currentRound?.word != null) {
    return <PictionaryWordToDraw word={currentRound.word} />;
  } else if (currentRound?.letters != null) {
    return <PictionaryWordToGuess letters={currentRound.letters} />;
  } else {
    return null;
  }
};

const PictionaryWordToDraw = ({ word }: { word: string }) => {
  return <span className="game-pictionary__word-to-draw">{word}</span>;
};

const PictionaryWordToGuess = ({ letters }: { letters: string[] }) => {
  return (
    <div className="game-pictionary__word-to-guess">
      {letters.map((letter, i) => (
        <span className="game-pictionary__letter" key={i}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default PictionaryGame;
