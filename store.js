export class Store {
  constructor() {
    this.tools = {
      isSelectToolEnabled: false,
      isMoveToolEnabled: false,
      isDrawingToolEnabled: false,
    };
    this.controls = {
      isCursorAtDrawingStartPoint: true,
      isMouseDown: false,
    };
    this.canvas = {
      coordinates: {
        x: 0,
        y: 0,
      },
      cursorCoordinates: {
        x: 0,
        y: 0,
      },
      brushSize: 2,
    };
    this.shapes = [];
    this.shapeSelectedToDraw = null;
    this.shapeSelected = null;
  }
  getState = () => ({
    controls: this.controls,
    canvas: this.canvas,
    shapes: this.shapes,
  });
  getTools = () => this.tools;
  getControls = () => this.controls;
  getCanvasCoordinates = () => this.canvas.coordinates;
  getCanvasCursorCoordinates = () => this.canvas.cursorCoordinates;
  getBrushSize = () => this.canvas.brushSize;
  getShapeSelected = () => this.shapeSelected;

  setIsSelectToolEnabled = (isEnabled) =>
    (this.tools.isSelectToolEnabled = isEnabled);

  setIsMoveToolEnabled = (isEnabled) =>
    (this.tools.isMoveToolEnabled = isEnabled);

  setIsDrawingToolEnabled = (isEnabled) =>
    (this.tools.isDrawingToolEnabled = isEnabled);

  setIsCursorAtDrawingStartPoint = (value) => {
    this.controls.isCursorAtDrawingStartPoint = value;
  };
  setIsMouseDown = (isMouseDown) => (this.controls.isMouseDown = isMouseDown);
  setCanvasCoordinates = (newCoordinates) => {
    this.canvas.coordinates = { ...newCoordinates };
  };
  setCanvasCursorCoordinates = (newCoordinates) => {
    this.canvas.cursorCoordinates = { ...newCoordinates };
  };
  setShapeSelectedToDraw = (newShape) => (this.shapeSelectedToDraw = newShape);
  setShapeSelected = (newShape) => (this.shapeSelected = newShape);
}

export const store = new Store();
