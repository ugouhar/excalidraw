import { store } from "../store.js";
import { Shape } from "./shape.js";

export class Circle extends Shape {
  constructor(canvas) {
    super(canvas);

    this.dimensions = {
      x: 0,
      y: 0,
      radius: 0,
      startAngle: 0,
      endAngle: 0,
      counterclockwise: false,
    };
  }

  draw = (event) => {
    this.clearCanvas();
    this.startDrawing(event);

    // update brush
    // update dimension
    // command manager
    // undo redo

    this.dimensions.x = this.startCoord.x;
    this.dimensions.y = this.startCoord.y;
    this.dimensions.radius = Math.abs(
      event.clientX - store.getCanvasCoordinates().x - this.startCoord.x
    );
    this.dimensions.startAngle = 0;
    this.dimensions.endAngle = 0;

    const path = new Path2D();
    path.arc(
      this.dimensions.x,
      this.dimensions.y,
      this.dimensions.radius,
      0,
      2 * Math.PI
    );

    if (Shape.list.length > 0) Shape.list.pop();
    Shape.list.push({
      path,
      dimensions: this.dimensions,
    });

    this.redrawAllShapes();
  };
}
