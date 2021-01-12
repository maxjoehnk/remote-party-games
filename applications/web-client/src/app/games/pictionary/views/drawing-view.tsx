import DrawingArea from '../../../game-widgets/drawing/drawing-area.component';
import { draw } from '../pictionary-api';
import DrawingCanvas from '../../../game-widgets/drawing/drawing-canvas.component';
import PencilTool from '../../../game-widgets/drawing/tools/pencil-tool.component';
import EraserTool from '../../../game-widgets/drawing/tools/eraser-tool.component';
import UndoButton from '../../../game-widgets/drawing/tools/undo-btn.component';
import RedoButton from '../../../game-widgets/drawing/tools/redo-btn.component';
import ClearCanvasButton from '../../../game-widgets/drawing/tools/clear-canvas-btn.component';
import ColorPicker from '../../../game-widgets/drawing/tools/color-picker.component';
import React from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../pictionary-constants';

export const PictionaryDrawingView = () => {
  return (
    <div className="pictionary-draw-area">
      <DrawingArea onActionChange={actions => draw(actions)}>
        <DrawingCanvas
          className="game-pictionary__canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
        <div className="pictionary-draw-area__tools">
          <PencilTool />
          <EraserTool />
          <ClearCanvasButton />
          <UndoButton />
          <RedoButton />
        </div>
        <div className="pictionary-draw-area__color-picker">
          <ColorPicker />
        </div>
      </DrawingArea>
    </div>
  );
};
