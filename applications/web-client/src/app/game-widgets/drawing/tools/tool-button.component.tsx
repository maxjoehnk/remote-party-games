import { DrawingAreaState, DrawingContext } from '../drawing-context';
import Icon from '@mdi/react';
import React from 'react';

export interface ToolButtonProps {
  icon: string;
  action: (context: DrawingAreaState) => void;
  active?: (context: DrawingAreaState) => boolean;
  disabled?: (context: DrawingAreaState) => boolean;
}

const ToolButton = ({ icon, action, active, disabled }: ToolButtonProps) => {
  const canBeActive = !!active;
  const isDisabled = context => (disabled == null ? false : disabled(context));

  return (
    <DrawingContext.Consumer>
      {context => (
        <button
          type="button"
          onClick={() => action(context)}
          disabled={isDisabled(context)}
          className={`icon-button ${
            canBeActive && active(context) ? 'icon-button--active' : 'icon-button--hint'
          }`}
        >
          <Icon path={icon} size={1} />
        </button>
      )}
    </DrawingContext.Consumer>
  );
};

export default ToolButton;
