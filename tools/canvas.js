import { CIRCLE, RECTANGLE } from "../constants.js";
import { Shape } from "../shapes/shape.js";
import { store } from "../store.js";

export class CanvasManager {
  constructor(canvas, rectangle, circle) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "black";
    this.rectangle = rectangle;
    this.circle = circle;
    this.isDrawingEnabled = false;
    this.shapeSelectedToDraw = RECTANGLE;
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mousemove", this.drawShape);
  }

  setShape = (shape) => (this.shapeSelectedToDraw = shape);

  updateBrush = (lineWidth = 2, strokeColor = "black") => {
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeColor;
  };

  drawShape = (event) => {
    if (!this.isDrawingEnabled) return;
    switch (this.shapeSelectedToDraw) {
      case RECTANGLE:
        this.rectangle.draw(event);
        break;
      case CIRCLE:
        this.circle.draw(event);
        break;
      default:
        console.log("Unknown shape");
    }
  };

  computeCanvasPosition = () => {
    const canvasComputedStyle = this.canvas.getBoundingClientRect();
    const { x, y } = canvasComputedStyle;
    store.setCanvasCoordinates({ x, y });
  };

  onMouseDown = () => {
    this.isDrawingEnabled = true;
  };

  onMouseUp = () => {
    this.isDrawingEnabled = false;
    store.setIsMousePositionForStartingCoordinates(true);
    Shape.list.push({});
  };
}
