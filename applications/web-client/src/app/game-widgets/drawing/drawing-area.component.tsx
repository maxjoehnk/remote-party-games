import React from 'react';
import {
  CanvasRef,
  defaultState,
  DrawingAction,
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
  onActionChange?: (actions: DrawingAction[]) => void;
}

class DrawingArea extends React.Component<DrawingAreaProps, DrawingAreaState> {
  state: DrawingAreaState = defaultState;

  get contextState(): Required<DrawingAreaState> {
    const contextState: Required<DrawingAreaState> = {
      ...this.state,
      selectTool: this.selectTool,
      setCanvas: this.setCanvas,
      setColor: this.setColor,
      setThickness: this.setThickness,
      clear: this.clear,
      pushAction: this.pushAction,
      undo: this.undo,
      redo: this.redo,
    };

    return contextState;
  }

  componentDidUpdate(prevProps: Readonly<DrawingAreaProps>, prevState: Readonly<DrawingAreaState>) {
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
    if (prevState.actions !== this.state.actions) {
      this.props.onActionChange && this.props.onActionChange(this.state.actions);
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

  private setThickness = (thickness: number) => {
    this.setState(state => ({ ...state, thickness }));
  };

  private setCanvas = (canvas: CanvasRef) => {
    this.setState(state => ({ ...state, canvas }));
  };

  private pushAction = (action: DrawingAction) => {
    this.setState(state => {
      const history = [...state.actions, action];
      return updateActions({
        ...state,
        history,
        historyPointer: history.length,
      });
    });
  };

  private undo = () => {
    this.setState(state =>
      updateActions({
        ...state,
        historyPointer: Math.max(0, state.historyPointer - 1),
      })
    );
  };

  private redo = () => {
    this.setState(state =>
      updateActions({
        ...state,
        historyPointer: Math.min(state.history.length, state.historyPointer + 1),
      })
    );
  };

  private clear = () => {
    this.state.canvas.clear();
    this.setState(state => updateActions({ ...state, history: [], historyPointer: 0 }));
  };
}

function getActions(state: DrawingAreaState): DrawingAction[] {
  return state.history.slice(0, state.historyPointer);
}

function updateActions(nextState: DrawingAreaState): DrawingAreaState {
  nextState.actions = getActions(nextState);
  return nextState;
}

export default DrawingArea;
