import { mdiFormatColorFill } from '@mdi/js';
import React from 'react';
import { DrawingTool } from '../drawing-context';
import ToolButton from './tool-button.component';

const FillTool = () => {
  return (
    <ToolButton
      icon={mdiFormatColorFill}
      action={({ selectTool }) => selectTool(DrawingTool.Fill)}
      active={({ tool }) => tool === DrawingTool.Fill}
    />
  );
};

export default FillTool;
