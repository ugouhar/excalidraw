import { store } from "../store.js";
import { Arrow } from "./arrow.js";
import { Circle } from "./circle.js";
import { Line } from "./line.js";
import { FreehandView } from "./freehand.js";
import { Rectangle } from "./rectangle.js";

let startX, startY;

export const computeStartingCoordinatesForDrawing = () => {
  startX = store.getCanvasCursorCoordinates().x;
  startY = store.getCanvasCursorCoordinates().y;
};

export const drawRectangle = () => {
  const width = store.getCanvasCursorCoordinates().x - startX;
  const height = store.getCanvasCursorCoordinates().y - startY;
  return new Rectangle(startX, startY, width, height);
};

export const drawCircle = () => {
  const radius = Math.abs(store.getCanvasCursorCoordinates().x - startX);
  return new Circle(startX, startY, radius);
};

export const drawLine = () => {
  const x2 = store.getCanvasCursorCoordinates().x;
  const y2 = store.getCanvasCursorCoordinates().y;
  return new Line(startX, startY, x2, y2);
};

export const drawArrow = () => {
  const x2 = store.getCanvasCursorCoordinates().x;
  const y2 = store.getCanvasCursorCoordinates().y;
  return new Arrow(startX, startY, x2, y2);
};

export const drawFreehand = () => {
  const x = store.getCanvasCursorCoordinates().x;
  const y = store.getCanvasCursorCoordinates().y;
  return new FreehandView(x, y, 10);
};
