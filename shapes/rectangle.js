import { store } from "../store.js";
import { Shape } from "./shape.js";

export class Rectangle extends Shape {
  constructor(canvas) {
    super(canvas);

    this.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  draw = (event) => {
    this.clearCanvas();
    this.startDrawing(event);

    this.dimensions.x = this.startCoord.x;
    this.dimensions.y = this.startCoord.y;
    this.dimensions.width =
      event.clientX - store.getCanvasCoordinates().x - this.startCoord.x;
    this.dimensions.height =
      event.clientY - store.getCanvasCoordinates().y - this.startCoord.y;

    const path = new Path2D();
    path.rect(
      this.dimensions.x,
      this.dimensions.y,
      this.dimensions.width,
      this.dimensions.height
    );

    if (Shape.list.length > 0) Shape.list.pop();
    Shape.list.push({
      path,
      dimensions: this.dimensions,
    });

    this.redrawAllShapes();
  };
}
