import { getCanvasCursorCoordinates } from "../utils/utils.js";
import { Circle } from "./circle.js";
import { Line } from "./line.js";
import { Rectangle } from "./rectangle.js";

let startX, startY;

export const computeStartingCoordinatesForDrawing = (event) => {
  startX = getCanvasCursorCoordinates(event).x;
  startY = getCanvasCursorCoordinates(event).y;
};

export const drawRectangle = (event) => {
  const width = getCanvasCursorCoordinates(event).x - startX;
  const height = getCanvasCursorCoordinates(event).y - startY;
  return new Rectangle(startX, startY, width, height);
};

export const drawCircle = (event) => {
  const radius = Math.abs(getCanvasCursorCoordinates(event).x - startX);
  return new Circle(startX, startY, radius);
};

export const drawLine = (event) => {
  const x2 = getCanvasCursorCoordinates(event).x;
  const y2 = getCanvasCursorCoordinates(event).y;
  return new Line(startX, startY, x2, y2);
};
