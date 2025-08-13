export class Store {
  constructor() {
    this.tools = {
      isSelectToolEnabled: false,
      isMoveToolEnabled: false,
      isDrawingToolEnabled: false,
    };
    this.controls = {
      isCursorAtDrawingStartPoint: true,
    };
    this.canavas = {
      coordinates: {
        x: 0,
        y: 0,
      },
      brushSize: 2,
    };
    this.shapes = [];
    this.shapeSelectedToDraw = "RECTANGLE";
  }
  getState = () => ({
    controls: this.controls,
    canvas: this.canavas,
    shapes: this.shapes,
  });
  getTools = () => this.tools;
  getControls = () => this.controls;
  getCanvasCoordinates = () => this.canavas.coordinates;
  getBrushSize = () => this.canavas.brushSize;

  setIsSelectToolEnabled = (isEnabled) =>
    (this.tools.isSelectToolEnabled = isEnabled);

  setIsMoveToolEnabled = (isEnabled) =>
    (this.tools.isMoveToolEnabled = isEnabled);

  setIsDrawingToolEnabled = (isEnabled) =>
    (this.tools.isDrawingToolEnabled = isEnabled);

  setIsCursorAtDrawingStartPoint = (value) => {
    this.controls.isCursorAtDrawingStartPoint = value;
  };
  setCanvasCoordinates = (newCoordinates) => {
    this.canavas.coordinates = { ...newCoordinates };
  };
  setShapeSelectedToDraw = (newShape) => (this.shapeSelectedToDraw = newShape);
}

export const store = new Store();
