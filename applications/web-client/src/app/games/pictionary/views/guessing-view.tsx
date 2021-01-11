import { useSelector } from 'react-redux';
import { selectPictionaryCurrentRound } from '../../../../store/selectors/pictionary';
import ReadOnlyArea from '../../../game-widgets/drawing/read-only-area.component';
import DrawingCanvas from '../../../game-widgets/drawing/drawing-canvas.component';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../pictionary-constants';
import React from 'react';

export const PictionaryGuessingView = () => {
  const currentRound = useSelector(selectPictionaryCurrentRound);

  return (
    <div className="card">
      <ReadOnlyArea actions={currentRound?.drawingActions ?? []}>
        <DrawingCanvas
          className="game-pictionary__canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
      </ReadOnlyArea>
    </div>
  );
};
