import React from 'react';
import { defaultState, DrawingAction, DrawingAreaState, DrawingContext } from './drawing-context';

export interface ReadOnlyAreaProps {
  children;
  actions: DrawingAction[];
}

class ReadOnlyArea extends React.Component<ReadOnlyAreaProps, DrawingAreaState> {
  state: DrawingAreaState = defaultState;

  render() {
    const drawingState: DrawingAreaState = {
      ...this.state,
      readOnly: true,
      actions: this.props.actions,
      setCanvas: () => {},
    };

    return (
      <DrawingContext.Provider value={drawingState}>{this.props.children}</DrawingContext.Provider>
    );
  }
}

export default ReadOnlyArea;
