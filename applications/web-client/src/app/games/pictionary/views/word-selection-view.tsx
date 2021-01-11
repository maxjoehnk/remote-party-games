import { useSelector } from 'react-redux';
import { selectPictionaryAvailableWords } from '../../../../store/selectors/pictionary';
import Button from '../../../ui-elements/button/button.component';
import { selectWord } from '../pictionary-api';
import React from 'react';

export const WordSelectionView = () => {
  const words = useSelector(selectPictionaryAvailableWords);
  return (
    <div className="card game-pictionary__word-selection">
      {words.map(word => (
        <Button onClick={() => selectWord(word)} key={word}>
          {word}
        </Button>
      ))}
    </div>
  );
};
