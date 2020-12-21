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
  canvas?: CanvasRef;

  selectTool?: (tool: DrawingTool) => void;
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
};

export const DrawingContext = createContext<DrawingAreaState>(defaultState);
