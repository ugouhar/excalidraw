import { store } from "../store.js";
import { Shape } from "./shape.js";

export class Circle extends Shape {
  constructor(canvas) {
    super(canvas);

    this.prevDimensions = {
      x: 0,
      y: 0,
      radius: 0,
      startAngle: 0,
      endAngle: 0,
      counterclockwise: false,
    };

    this.currDimensions = {
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
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "black";

    this.currDimensions.x = this.startCoord.x;
    this.currDimensions.y = this.startCoord.y;
    this.currDimensions.radius = Math.abs(
      event.clientX - store.getCanvasCoordinates().x - this.startCoord.x
    );
    this.currDimensions.startAngle = 0;
    this.currDimensions.endAngle = 0;

    const path = new Path2D();
    path.arc(
      this.currDimensions.x,
      this.currDimensions.y,
      this.currDimensions.radius,
      0,
      2 * Math.PI
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
