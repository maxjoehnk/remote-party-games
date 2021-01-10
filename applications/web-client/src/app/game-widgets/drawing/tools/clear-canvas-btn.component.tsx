import { mdiTrashCan } from '@mdi/js';
import React from 'react';
import ToolButton from './tool-button.component';

const ClearCanvasButton = () => {
  return <ToolButton icon={mdiTrashCan} action={({ clear }) => clear()} />;
};

export default ClearCanvasButton;
