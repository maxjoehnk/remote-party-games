import { Component, createContext } from 'react';

const DEFAULT_THICKNESS = 4;
const DEFAULT_COLOR = 'black';

export enum DrawingTool {
  Pen = 0,
  Eraser = 1,
  Fill = 2,
}

export interface DrawingAreaState {
  tool: DrawingTool;
  color: string;
  thickness: number;
  canvas: CanvasRef | null;

  actions: DrawingAction[];
  history: DrawingAction[];
  historyPointer: number;

  selectTool?: (tool: DrawingTool) => void;
  setColor?: (color: string) => void;
  setThickness?: (thickness: number) => void;
  clear?: () => void;
  undo?: () => void;
  redo?: () => void;

  pushAction?: (action: DrawingAction) => void;
  setCanvas?: (canvas: CanvasRef) => void;
}

export interface CanvasRef extends Component<CanvasProps> {
  clear();

  save(): Promise<Blob>;
  load(image: HTMLImageElement);
}

export interface CanvasProps {
  width: number;
  height: number;
}

export const defaultState: DrawingAreaState = {
  tool: DrawingTool.Pen,
  color: DEFAULT_COLOR,
  thickness: DEFAULT_THICKNESS,
  canvas: null,
  actions: [],
  history: [],
  historyPointer: 0,
};

export const DrawingContext = createContext<DrawingAreaState>(defaultState);

export type DrawingAction = Line;

export interface Coordinate {
  x: number;
  y: number;
}

export interface Line {
  tool: DrawingTool.Pen | DrawingTool.Eraser;
  start: Coordinate;
  elements: LineElement[];
  color: string;
}

export interface LineElement {
  x: number;
  y: number;
  thickness: number;
}
