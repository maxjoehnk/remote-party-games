import ReadOnlyArea from '../../../game-widgets/drawing/read-only-area.component';
import DrawingCanvas from '../../../game-widgets/drawing/drawing-canvas.component';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../pictionary-constants';
import React, { useEffect, useState } from 'react';
import { subscribePictionaryImageUpdate } from '../pictionary-subscriptions';

export const PictionaryGuessingView = () => {
  const [drawing, setDrawing] = useState([]);
  useEffect(() => {
    const subscription = subscribePictionaryImageUpdate(drawing => setDrawing(drawing));

    return () => subscription.unsubscribe();
  });

  return (
    <div className="card">
      <ReadOnlyArea actions={drawing}>
        <DrawingCanvas
          className="game-pictionary__canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
      </ReadOnlyArea>
    </div>
  );
};
