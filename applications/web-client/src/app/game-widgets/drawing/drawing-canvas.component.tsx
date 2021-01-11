import React, { RefObject } from 'react';
import {
  CanvasProps,
  CanvasRef,
  DrawingAction,
  DrawingContext,
  DrawingTool,
  Line,
} from './drawing-context';
import './drawing-area.component.css';

export interface DrawingCanvasState {
  isMouseDown: boolean;
  context?: CanvasRenderingContext2D;
  boundingRect?: DOMRect;
  currentLine?: Line;
}

interface PenPosition {
  x: number;
  y: number;
  pressure: number;
}

class DrawingCanvas extends React.Component<CanvasProps, DrawingCanvasState> implements CanvasRef {
  private canvas: RefObject<HTMLCanvasElement>;
  private loadedImage: HTMLImageElement;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      isMouseDown: false,
      context: null,
      currentLine: null,
    };
  }

  private get canvasContext(): CanvasRenderingContext2D {
    return this.state.context;
  }

  componentDidUpdate(): void {
    const { tool, thickness, color } = this.context;
    this.canvasContext.lineWidth = thickness;
    this.applyTool(tool, color);
  }

  private applyTool(tool: DrawingTool, color: string) {
    if (tool === DrawingTool.Pen) {
      this.canvasContext.strokeStyle = color;
      this.canvasContext.globalCompositeOperation = 'source-over';
    } else if (tool === DrawingTool.Eraser) {
      this.canvasContext.strokeStyle = 'white';
      this.canvasContext.globalCompositeOperation = 'destination-out';
    }
  }

  componentDidMount(): void {
    this.context.setCanvas(this);
    const canvas = this.canvas.current;
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('touchstart', this.onTouchStart);
    canvas.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
    canvas.addEventListener('wheel', this.onScroll);
    const context = canvas.getContext('2d');
    context.strokeStyle = this.context.color;
    context.lineWidth = this.context.thickness;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    const boundingRect = canvas.getBoundingClientRect();
    this.setState({
      ...this.state,
      context,
      boundingRect,
    });
  }

  render() {
    this.redrawCanvas();
    return (
      <canvas
        className={`drawing-area ${this.props.className}`}
        width={this.props.width}
        height={this.props.height}
        style={{ width: `${this.props.width}px`, height: `${this.props.height}px` }}
        ref={this.canvas}
      />
    );
  }

  private redrawCanvas() {
    if (this.canvasContext == null) {
      return;
    }
    this.canvasContext.clearRect(0, 0, this.props.width, this.props.height);
    if (this.loadedImage) {
      this.canvasContext.drawImage(this.loadedImage, 0, 0);
    }
    for (const action of this.context.actions) {
      this.drawAction(action);
    }
    if (this.state.currentLine) {
      this.drawAction(this.state.currentLine);
    }
  }

  private drawAction(action: DrawingAction) {
    this.applyTool(action.tool, action.color);
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(action.start.x, action.start.y);
    for (const element of action.elements) {
      this.canvasContext.lineTo(element.x, element.y);
      this.canvasContext.lineWidth = element.thickness;
      this.canvasContext.stroke();
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(element.x, element.y);
    }
  }

  public clear = () => {
    if (this.canvasContext == null) {
      return;
    }
    this.loadedImage = null;
    this.canvasContext.clearRect(0, 0, this.props.width, this.props.height);
  };

  public async save(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.current.toBlob(resolve);
    });
  }

  private onMouseDown = (e: MouseEvent) => this.onPointerStart(e, this.getMousePoint(e));

  private onMouseMove = (e: MouseEvent) => this.onPointerMove(e, this.getMousePoint(e));

  private onMouseUp = (e: MouseEvent) => this.onPointerEnd(e, this.getMousePoint(e));

  private getMousePoint(e: MouseEvent): PenPosition {
    const x = e.clientX - this.state.boundingRect.x;
    const y = e.clientY - this.state.boundingRect.y;

    return {
      x,
      y,
      pressure: 1,
    };
  }

  private onTouchStart = (e: TouchEvent) => {
    const coordinate = this.getTouchPoint(e);

    this.onPointerStart(e, coordinate);
  };

  private onTouchMove = (e: TouchEvent) => {
    const coordinate = this.getTouchPoint(e);
    this.onPointerMove(e, coordinate);
  };

  private onTouchEnd = (e: TouchEvent) => {
    const coordinate = this.getTouchPoint(e);

    this.onPointerEnd(e, coordinate);
  };

  private getTouchPoint(e: TouchEvent): PenPosition | null {
    const touch = e.targetTouches.item(0);
    if (touch == null) {
      return null;
    }
    const x = touch.clientX - this.state.boundingRect.x;
    const y = touch.clientY - this.state.boundingRect.y;
    const pressure = touch.force === 0 ? 1 : touch.force;

    return { x, y, pressure };
  }

  private onPointerStart = (e: TouchEvent | MouseEvent, position: PenPosition) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isMouseDown: true,
    });
    this.startNewLine(position);
    this.startLineElement(position);
  };

  private onPointerMove(e: MouseEvent | TouchEvent, position: PenPosition) {
    if (!this.state.isMouseDown) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.draw(position);
  }

  private onPointerEnd = (e: MouseEvent | TouchEvent, position: PenPosition) => {
    if (!this.state.isMouseDown) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isMouseDown: false });
    this.finishLine();
  };

  private stopLineElement = ({ x, y, pressure }: PenPosition) => {
    this.canvasContext.lineTo(x, y);
    this.canvasContext.lineWidth = this.context.thickness * pressure;
    this.canvasContext.stroke();
  };

  private startLineElement = ({ x, y }: PenPosition) => {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x, y);
  };

  private draw = (coordinate: PenPosition) => {
    this.stopLineElement(coordinate);
    this.startLineElement(coordinate);
    this.pushLineElement(coordinate);
  };

  private startNewLine(coordinate: PenPosition) {
    this.setState(state => ({
      ...state,
      currentLine: {
        color: this.context.color,
        start: coordinate,
        elements: [],
        tool: this.context.tool,
      },
    }));
  }

  private pushLineElement({ x, y, pressure }: PenPosition) {
    this.setState(state => ({
      ...state,
      currentLine: {
        ...state.currentLine,
        elements: [
          ...state.currentLine.elements,
          {
            thickness: this.context.thickness * pressure,
            x,
            y,
          },
        ],
      },
    }));
  }

  private finishLine() {
    this.context.pushAction(this.state.currentLine);
    this.setState(state => ({
      ...state,
      currentLine: null,
    }));
  }

  private onScroll = (event: WheelEvent) => {
    const direction = clamp(event.deltaY, -1, 1);
    this.context.setThickness(this.context.thickness - direction);
  };

  load(img: HTMLImageElement) {
    this.canvasContext.drawImage(img, 0, 0);
    this.loadedImage = img;
  }
}
DrawingCanvas.contextType = DrawingContext;

type DrawingCanvasClass = new (props: CanvasProps, context?: any) => CanvasRef;

export default DrawingCanvas as DrawingCanvasClass;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
