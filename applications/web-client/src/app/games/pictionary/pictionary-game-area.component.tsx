import React from 'react';
import { useSelector } from 'react-redux';
import { selectPictionaryCurrentView } from '../../../store/selectors/pictionary';
import { PictionaryView } from '../../../store/reducers/pictionary';
import { PictionaryDrawingView } from './views/drawing-view';
import { WordSelectionView } from './views/word-selection-view';
import { PictionaryGuessingView } from './views/guessing-view';
import { PictionaryScoresView } from './views/scores-view';

const PictionaryGameArea = () => {
  const view = useSelector(selectPictionaryCurrentView);

  return (
    <div className="game-pictionary__game-area">
      {view === PictionaryView.WordSelection && <WordSelectionView />}
      {view === PictionaryView.Drawing && <PictionaryDrawingView />}
      {view === PictionaryView.Guessing && <PictionaryGuessingView />}
      {view === PictionaryView.Scores && <PictionaryScoresView />}
    </div>
  );
};

export default PictionaryGameArea;
