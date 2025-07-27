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
    this.list = [];
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
    if (width < 0 && height < 0) return TOP_LEFT;
    if (width > 0 && height < 0) return TOP_RIGHT;
    if (width < 0 && height > 0) return BOTTOM_LEFT;
    return BOTTOM_RIGHT;
  }
  getProperties() {
    return {
      x: this.startCoord.x,
      y: this.startCoord.y,
      width: this.size.width,
      height: this.size.height,
    };
  }

  resetPreviousSize() {
    this.prevSize.width = 0;
    this.prevSize.height = 0;
  }

  addRectangleToList(rect) {
    this.list.push(rect);
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
      this.prevSize.width + deltaW,
      this.prevSize.height + deltaH
    );
  }

  drawNewRectangle(event) {
    this.size.width =
      event.clientX - GlobalValues.canvasPosition.x - this.startCoord.x;
    this.size.height =
      event.clientY - GlobalValues.canvasPosition.y - this.startCoord.y;
    const rectangle = new Path2D();
    this.ctx.lineWidth = 2;

    rectangle.rect(
      this.startCoord.x,
      this.startCoord.y,
      this.size.width,
      this.size.height
    );
    this.ctx.stroke(rectangle);

    this.list.forEach((rect) => {
      rectangle.rect(rect.x, rect.y, rect.width, rect.height);
      this.ctx.stroke(rectangle);
    });
  }

  endDrawing() {
    this.prevSize.width = this.size.width;
    this.prevSize.height = this.size.height;
  }
}
