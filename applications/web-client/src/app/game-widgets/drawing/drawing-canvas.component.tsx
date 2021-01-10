import React, { RefObject } from 'react';
import { CanvasProps, CanvasRef, DrawingContext, DrawingTool } from './drawing-context';
import './drawing-area.component.css';

export interface DrawingCanvasState {
  isMouseDown: boolean;
  context?: CanvasRenderingContext2D;
  boundingRect?: DOMRect;
}

interface Coordinate {
  x: number;
  y: number;
  pressure: number;
}

class DrawingCanvas extends React.Component<CanvasProps, DrawingCanvasState> implements CanvasRef {
  private canvas: RefObject<HTMLCanvasElement>;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      isMouseDown: false,
      context: null,
    };
  }

  private get canvasContext(): CanvasRenderingContext2D {
    return this.state.context;
  }

  componentDidUpdate(): void {
    const { tool, thickness, color } = this.context;
    this.canvasContext.lineWidth = thickness;
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
    return (
      <canvas
        className="drawing-area"
        width={this.props.width}
        height={this.props.height}
        style={{ width: `${this.props.width}px`, height: `${this.props.height}px` }}
        ref={this.canvas}
      />
    );
  }

  public clear = () => {
    if (this.canvasContext == null) {
      return;
    }
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

  private getMousePoint(e: MouseEvent): Coordinate {
    return {
      x: e.offsetX,
      y: e.offsetY,
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

  private getTouchPoint(e: TouchEvent): Coordinate | null {
    const touch = e.targetTouches.item(0);
    if (touch == null) {
      return null;
    }
    const x = touch.clientX - this.state.boundingRect.x;
    const y = touch.clientY - this.state.boundingRect.y;
    const pressure = touch.force === 0 ? 1 : touch.force;

    return { x, y, pressure };
  }

  private onPointerStart = (e: TouchEvent | MouseEvent, coordinate: Coordinate) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isMouseDown: true,
    });
    this.startLine(coordinate);
  };

  private onPointerMove(e: MouseEvent | TouchEvent, coordinate: Coordinate) {
    if (!this.state.isMouseDown) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.draw(coordinate);
  }

  private onPointerEnd = (e: MouseEvent | TouchEvent, coordinate: Coordinate) => {
    if (!this.state.isMouseDown) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isMouseDown: false });
    if (coordinate == null) {
      return;
    }
    this.stopLine(coordinate);
  };

  private stopLine = ({ x, y, pressure }: Coordinate) => {
    this.canvasContext.lineTo(x, y);
    this.canvasContext.lineWidth = this.context.thickness * pressure;
    this.canvasContext.stroke();
  };

  private startLine = ({ x, y }: Coordinate) => {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x, y);
  };

  private draw = (coordinate: Coordinate) => {
    this.stopLine(coordinate);
    this.startLine(coordinate);
  };

  load(img: HTMLImageElement) {
    this.canvasContext.drawImage(img, 0, 0);
  }
}
DrawingCanvas.contextType = DrawingContext;

type DrawingCanvasClass = new (props: CanvasProps, context?: any) => CanvasRef;

export default DrawingCanvas as DrawingCanvasClass;
