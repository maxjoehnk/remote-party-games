import React from 'react';
import {
  CanvasRef,
  defaultState,
  DrawingAction,
  DrawingAreaState,
  DrawingContext,
  DrawingTool,
} from './drawing-context';
import { DrawingAreaProps } from './drawing-area.component';

export interface ReadOnlyAreaProps {
  children;
  actions: DrawingAction[];
}

class ReadOnlyArea extends React.Component<ReadOnlyAreaProps, DrawingAreaState> {
  state: DrawingAreaState = defaultState;

  render() {
    const drawingState: DrawingAreaState = {
      ...this.state,
      actions: this.props.actions,
      setCanvas: () => {},
    };

    return (
      <DrawingContext.Provider value={drawingState}>{this.props.children}</DrawingContext.Provider>
    );
  }
}

export default ReadOnlyArea;
