import { GlobalValues } from "../global.js";
const TOP_LEFT = "TOP_LEFT";
const TOP_RIGHT = "TOP_RIGHT";
const BOTTOM_LEFT = "BOTTOM_LEFT";
const BOTTOM_RIGHT = "BOTTOM_RIGHT";

export class Rectangle {
  constructor(canvas) {
    this.prevSize = {
      width: 0,
      height: 0,
    };
    this.startCoord = {
      x: 0,
      y: 0,
    };
    this.size = {
      width: 0,
      height: 0,
    };
    this.ctx = canvas.getContext("2d");
  }

  startDrawing(event) {
    if (GlobalValues.controls.isMousePositionForStartingCoordinates) {
      this.startCoord.x = event.clientX - GlobalValues.canvasPosition.x;
      this.startCoord.y = event.clientY - GlobalValues.canvasPosition.y;
      GlobalValues.controls.isMousePositionForStartingCoordinates = false;
    }
  }

  getDirection() {
    const { width, height } = this.size;
    const { x, y } = this.startCoord;
    console.log(width, height, x, y);
    if (width < 0 && height < 0) return TOP_LEFT;
    if (width > 0 && height < 0) return TOP_RIGHT;
    if (width < 0 && height > 0) return BOTTOM_LEFT;
    return BOTTOM_RIGHT;
  }

  clearPrevRectangle() {
    const direction = this.getDirection();
    console.log(direction);
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
    console.log(deltaW, deltaH);
    this.ctx.clearRect(
      this.startCoord.x + deltaX,
      this.startCoord.y + deltaY,
      this.prevSize.width + deltaW,
      this.prevSize.height + deltaH
    );
  }

  drawNewRectangle(event) {
    const rectangle = new Path2D();

    this.size.width =
      event.clientX - GlobalValues.canvasPosition.x - this.startCoord.x;
    this.size.height =
      event.clientY - GlobalValues.canvasPosition.y - this.startCoord.y;

    rectangle.rect(
      this.startCoord.x,
      this.startCoord.y,
      this.size.width,
      this.size.height
    );
    this.ctx.lineWidth = 2;
    this.ctx.stroke(rectangle);
  }

  endDrawing() {
    this.prevSize.width = this.size.width;
    this.prevSize.height = this.size.height;
  }
}
