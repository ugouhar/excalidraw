import { store } from "../store.js";
import { Shape } from "./shape.js";

export class Rectangle extends Shape {
  constructor(canvas) {
    super(canvas);

    this.prevDimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    this.currDimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  draw = (event) => {
    this.clearCanvas();
    this.startDrawing(event);

    this.currDimensions.x = this.startCoord.x;
    this.currDimensions.y = this.startCoord.y;
    this.currDimensions.width =
      event.clientX - store.getCanvasCoordinates().x - this.startCoord.x;
    this.currDimensions.height =
      event.clientY - store.getCanvasCoordinates().y - this.startCoord.y;

    const path = new Path2D();
    path.rect(
      this.currDimensions.x,
      this.currDimensions.y,
      this.currDimensions.width,
      this.currDimensions.height
    );

    if (Shape.list.length > 0) Shape.list.pop();
    Shape.list.push({
      path,
      dimensions: this.currDimensions,
    });

    this.redrawAllShapes();

    this.endDrawing();
  };
}
