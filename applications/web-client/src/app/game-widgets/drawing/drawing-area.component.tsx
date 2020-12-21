import React from 'react';
import {
  CanvasRef,
  defaultState,
  DrawingAreaState,
  DrawingContext,
  DrawingTool,
} from './drawing-context';
import './drawing-area.component.css';

export interface DrawingAreaProps {
  children;
  tool?: DrawingTool;
  thickness?: number;
  color?: string;
}

class DrawingArea extends React.Component<DrawingAreaProps, DrawingAreaState> {
  state: DrawingAreaState = defaultState;

  get contextState(): Required<DrawingAreaState> {
    return {
      ...this.state,
      selectTool: this.selectTool,
      setCanvas: this.setCanvas,
      setColor: this.setColor,
    };
  }

  componentDidUpdate(prevProps: Readonly<DrawingAreaProps>) {
    const { color, thickness, tool } = this.props;
    if (prevProps.thickness != thickness) {
      this.setState(state => ({ ...state, thickness }));
    }
    if (prevProps.tool != tool) {
      this.setState(state => ({ ...state, tool }));
    }
    if (prevProps.color != color) {
      this.setState(state => ({ ...state, color }));
    }
  }

  render() {
    return (
      <DrawingContext.Provider value={this.contextState}>
        {this.props.children}
      </DrawingContext.Provider>
    );
  }

  private selectTool = (tool: DrawingTool) => {
    this.setState(state => ({ ...state, tool }));
  };

  private setColor = (color: string) => {
    this.setState(state => ({ ...state, color }));
  };

  private setCanvas = (canvas: CanvasRef) => {
    this.setState(state => ({ ...state, canvas }));
  };
}

export default DrawingArea;
