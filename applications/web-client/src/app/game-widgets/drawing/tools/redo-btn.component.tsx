import { mdiRedo } from '@mdi/js';
import React from 'react';
import ToolButton from './tool-button.component';

const RedoButton = () => {
  return (
    <ToolButton
      icon={mdiRedo}
      action={({ redo }) => redo()}
      disabled={({ history, historyPointer }) => history.length === historyPointer}
    />
  );
};

export default RedoButton;
