import { store } from "../store.js";
import { Circle } from "./circle.js";
import { Line } from "./line.js";
import { Rectangle } from "./rectangle.js";

let startX, startY;

export const computeStartingCoordinates = (event) => {
  startX = event.clientX - store.getCanvasCoordinates().x;
  startY = event.clientY - store.getCanvasCoordinates().y;
};

export const drawRectangle = (event) => {
  const width = event.clientX - store.getCanvasCoordinates().x - startX;
  const height = event.clientY - store.getCanvasCoordinates().y - startY;
  return new Rectangle(startX, startY, width, height);
};

export const drawCircle = (event) => {
  const radius = Math.abs(
    event.clientX - store.getCanvasCoordinates().x - startX
  );
  return new Circle(startX, startY, radius);
};

export const drawLine = (event) => {
  const x2 = event.clientX - store.getCanvasCoordinates().x;
  const y2 = event.clientY - store.getCanvasCoordinates().y;
  return new Line(startX, startY, x2, y2);
};
