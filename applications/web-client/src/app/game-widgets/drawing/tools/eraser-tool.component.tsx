import { mdiEraser } from '@mdi/js';
import React from 'react';
import { DrawingTool } from '../drawing-context';
import ToolButton from './tool-button.component';

const EraserTool = () => {
  return (
    <ToolButton
      icon={mdiEraser}
      action={({ selectTool }) => selectTool(DrawingTool.Eraser)}
      active={({ tool }) => tool === DrawingTool.Eraser}
    />
  );
};

export default EraserTool;
