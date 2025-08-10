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

  resetPreviousDimension() {
    this.prevDimensions = {
      x: 0,
      y: 0,
      radius: 0,
      startAngle: 0,
      endAngle: 0,
      counterclockwise: false,
    };
  }

  drawNewCircle(event) {
    this.currDimensions.x = this.startCoord.x;
    this.currDimensions.y = this.startCoord.y;
    this.currDimensions.radius = Math.abs(
      event.clientX - store.getCanvasCoordinates().x - this.startCoord.x
    );
    this.currDimensions.startAngle = 0;
    this.currDimensions.endAngle = 0;

    if (this.list.length > 0) this.list.pop();
    this.list.push({ ...this.currDimensions });

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.list.forEach((circle) => {
      const path = new Path2D();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "black";
      path.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      this.ctx.stroke(path);
    });
  }

  draw(event) {
    this.startDrawing(event);
    this.drawNewCircle(event);
    this.endDrawing();
  }
}
