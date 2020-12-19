import React, { RefObject } from 'react';
import './drawing-area.component.css';

const DEFAULT_THICKNESS = 4;
const DEFAULT_COLOR = 'black';

export enum DrawingTool {
  Pen,
  Eraser,
  Fill,
}

export interface DrawingAreaProps {
  width: number;
  height: number;
  tool?: DrawingTool;
  color?: string;
  thickness?: number;
}

export interface DrawingAreaState {
  isMouseDown: boolean;
  context?: CanvasRenderingContext2D;
}

class DrawingArea extends React.Component<DrawingAreaProps, DrawingAreaState> {
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
    const { tool, thickness, color } = this.props;
    this.canvasContext.lineWidth = thickness;
    if (tool === DrawingTool.Pen) {
      this.canvasContext.strokeStyle = color || DEFAULT_COLOR;
    } else if (tool === DrawingTool.Eraser) {
      this.canvasContext.strokeStyle = 'white';
    }
  }

  componentDidMount(): void {
    const canvas = this.canvas.current;
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('touchstart', this.onMouseDown);
    canvas.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('touchmove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchend', this.onMouseUp);
    const context = canvas.getContext('2d');
    context.strokeStyle = this.props.color || DEFAULT_COLOR;
    context.lineWidth = this.props.thickness || DEFAULT_THICKNESS;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    this.setState({
      ...this.state,
      context,
    });
  }

  render() {
    return (
      <canvas
        className="drawing-area"
        width={this.props.width}
        height={this.props.height}
        ref={this.canvas}
      />
    );
  }

  public clear() {
    this.canvasContext.clearRect(0, 0, this.props.width, this.props.height);
  }

  public async save(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.current.toBlob(resolve);
    });
  }

  private onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isMouseDown: true,
    });
    this.startLine(e.layerX, e.layerY);
  };

  private onMouseUp = e => {
    if (!this.state.isMouseDown) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isMouseDown: false });
    this.stopLine(e.layerX, e.layerY);
  };

  private onMouseMove = e => {
    if (!this.state.isMouseDown) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.draw(e.layerX, e.layerY);
  };

  private stopLine = (x, y) => {
    this.canvasContext.lineTo(x, y);
    this.canvasContext.stroke();
  };

  private startLine = (x, y) => {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x, y);
  };

  private draw = (x, y) => {
    this.stopLine(x, y);
    this.startLine(x, y);
  };

  load(img: Image) {
    this.canvasContext.drawImage(img, 0, 0);
  }
}

export default DrawingArea;
