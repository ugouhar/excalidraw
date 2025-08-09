import { RECTANGLE } from "../constants.js";
import { store } from "../store.js";

export class CanvasManager {
  constructor(canvas, rectangle) {
    this.canvas = canvas;
    this.rectangle = rectangle;
    this.isDrawingEnabled = false;
    this.shapeSelectedToDraw = RECTANGLE;
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mousemove", this.drawShape);
  }

  drawShape = (event) => {
    if (!this.isDrawingEnabled) return;
    switch (this.shapeSelectedToDraw) {
      case RECTANGLE:
        this.rectangle.draw(event);
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
    switch (this.shapeSelectedToDraw) {
      case RECTANGLE:
        this.rectangle.resetPreviousDimension();
        this.rectangle.addShapeToList(this.rectangle.getProperties());
        break;
      default:
        console.log("Unknown shape");
    }
  };
}
