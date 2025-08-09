import { RECTANGLE } from "../constants.js";
import { store } from "../store.js";

export class CanvasManager {
  constructor(canvas, rectangle) {
    this.canvas = canvas;
    this.rectangle = rectangle;
    this.isDrawingEnabled = false;
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mousemove", this.drawShape);
  }

  drawShape = (event) => {
    if (!this.isDrawingEnabled) return;
    switch (store.getShapeSelectedToDraw()) {
      case RECTANGLE:
        this.rectangle.draw(event);
        break;
      default:
        console.log("Unknown shape");
    }
  };

  computeCanvasPosition = () => {
    const canvasComputedStyle = getComputedStyle(this.canvas);
    const x_coordinate = parseInt(canvasComputedStyle.left.replace("px", ""));
    const y_coordinate = parseInt(canvasComputedStyle.top.replace("px", ""));

    store.setCanvasCoordinates({
      x: x_coordinate,
      y: y_coordinate,
    });
  };

  onMouseDown = () => {
    this.isDrawingEnabled = true;
  };

  onMouseUp = () => {
    this.isDrawingEnabled = false;
    store.setIsMousePositionForStartingCoordinates(true);
    switch (store.getShapeSelectedToDraw()) {
      case RECTANGLE:
        this.rectangle.resetPreviousDimension();
        this.rectangle.addShapeToList(this.rectangle.getProperties());
        break;
      default:
        console.log("Unknown shape");
    }
  };
}
