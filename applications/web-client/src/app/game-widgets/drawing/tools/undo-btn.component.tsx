import { mdiUndo } from '@mdi/js';
import React from 'react';
import ToolButton from './tool-button.component';

const UndoButton = () => {
  return (
    <ToolButton
      icon={mdiUndo}
      action={({ undo }) => undo()}
      disabled={({ historyPointer }) => historyPointer === 0}
    />
  );
};

export default UndoButton;
