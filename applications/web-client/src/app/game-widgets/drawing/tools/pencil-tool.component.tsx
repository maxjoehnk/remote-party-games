import { mdiPencil } from '@mdi/js';
import React from 'react';
import { DrawingTool } from '../drawing-context';
import ToolButton from './tool-button.component';

const PencilTool = () => {
  return (
    <ToolButton
      icon={mdiPencil}
      action={({ selectTool }) => selectTool(DrawingTool.Pen)}
      active={({ tool }) => tool === DrawingTool.Pen}
    />
  );
};

export default PencilTool;
