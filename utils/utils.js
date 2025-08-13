import { store } from "../store.js";

const delta = store.getBrushSize() / 2 + 1;

export const insideRectangle = (rectangle, x, y) => {
  const insideWidth =
    x >= rectangle.x - delta && x <= rectangle.x + rectangle.w + delta;

  const insideHeight =
    y >= rectangle.y - delta && y <= rectangle.y + rectangle.h + delta;

  return insideWidth && insideHeight;
};

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

export const insideCircle = (circle, x, y) => {
  const distanceFromCenter = calculateDistance(circle.x, circle.y, x, y);
  return distanceFromCenter <= circle.radius + delta;
};

export const getCanvasCursorCoordinates = (event) => {
  const x = event.clientX - store.getCanvasCoordinates().x;
  const y = event.clientY - store.getCanvasCoordinates().y;
  return { x, y };
};
