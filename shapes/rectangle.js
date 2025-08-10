import { store } from "../store.js";
import { Shape } from "./shape.js";
const TOP_LEFT = "TOP_LEFT";
const TOP_RIGHT = "TOP_RIGHT";
const BOTTOM_LEFT = "BOTTOM_LEFT";
const BOTTOM_RIGHT = "BOTTOM_RIGHT";

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

  getDirection() {
    const { width, height } = this.currDimensions;
    if (width < 0 && height < 0) return TOP_LEFT;
    if (width > 0 && height < 0) return TOP_RIGHT;
    if (width < 0 && height > 0) return BOTTOM_LEFT;
    return BOTTOM_RIGHT;
  }

  resetPreviousDimension() {
    this.prevDimensions.width = 0;
    this.prevDimensions.height = 0;
  }

  clearPrevRectangle() {
    const direction = this.getDirection();
    let deltaX = 0;
    let deltaY = 0;
    let deltaW = 0;
    let deltaH = 0;

    switch (direction) {
      case TOP_LEFT:
        deltaX = 1;
        deltaY = 1;
        deltaW = -2;
        deltaH = -2;
        break;
      case TOP_RIGHT:
        deltaX = -1;
        deltaY = +1;
        deltaW = +2;
        deltaH = -2;
        break;
      case BOTTOM_LEFT:
        deltaX = 1;
        deltaY = -1;
        deltaW = -2;
        deltaH = +2;
        break;
      case BOTTOM_RIGHT:
        deltaX = -1;
        deltaY = -1;
        deltaW = +2;
        deltaH = +2;
        break;
    }

    this.ctx.clearRect(
      this.startCoord.x + deltaX,
      this.startCoord.y + deltaY,
      this.prevDimensions.width + deltaW,
      this.prevDimensions.height + deltaH
    );
  }

  draw(event) {
    this.clearCanvas();
    this.startDrawing(event);

    this.currDimensions.x = this.startCoord.x;
    this.currDimensions.y = this.startCoord.y;
    this.currDimensions.width =
      event.clientX - store.getCanvasCoordinates().x - this.startCoord.x;
    this.currDimensions.height =
      event.clientY - store.getCanvasCoordinates().y - this.startCoord.y;

    if (this.list.length > 0) this.list.pop();
    this.list.push({ ...this.currDimensions });

    this.list.forEach((rect) => {
      const path = new Path2D();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "black";
      path.rect(rect.x, rect.y, rect.width, rect.height);
      this.ctx.stroke(path);
    });
    console.log(this.list);
    this.endDrawing();
  }
}
