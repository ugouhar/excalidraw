import { GlobalValues } from "../global.js";

export class Shape {
  constructor(canvas) {
    this.prevDimensions = {};
    this.startCoord = {
      x: 0,
      y: 0,
    };
    this.currDimensions = {};
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
  endDrawing() {
    this.prevDimensions = { ...this.currDimensions };
  }

  getProperties() {
    return {
      x: this.startCoord.x,
      y: this.startCoord.y,
      ...this.currDimensions,
    };
  }

  addShapeToList(shape) {
    this.list.push(shape);
  }
}
