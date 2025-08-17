import { ARROW, CIRCLE, LINE, RECTANGLE } from "../constants.js";
import { store } from "../store.js";

const delta = store.getBrushSize() / 2 + 1;

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

export const areCoordinatesInsideRectangle = (rectangle, x, y) => {
  const insideWidth =
    x >= rectangle.x - delta && x <= rectangle.x + rectangle.w + delta;

  const insideHeight =
    y >= rectangle.y - delta && y <= rectangle.y + rectangle.h + delta;

  return insideWidth && insideHeight;
};

export const areCoordinatesInsideCircle = (circle, x, y) => {
  const distanceFromCenter = calculateDistance(circle.x, circle.y, x, y);
  return distanceFromCenter <= circle.radius + delta;
};

export const areCoordinatesOnLine = (line, x, y) => {
  const d1 = calculateDistance(line.x1, line.y1, x, y);
  const d2 = calculateDistance(line.x2, line.y2, x, y);
  const d = calculateDistance(line.x1, line.y1, line.x2, line.y2);

  return d1 + d2 - d < 2;
};

export const areCursorCoordinatesInsideShape = (shape) => {
  const { x, y } = store.getCanvasCursorCoordinates();
  const shapeType = shape.type;

  return (
    (shapeType === RECTANGLE && areCoordinatesInsideRectangle(shape, x, y)) ||
    (shapeType === CIRCLE && areCoordinatesInsideCircle(shape, x, y)) ||
    (shapeType === LINE && areCoordinatesOnLine(shape, x, y)) ||
    (shapeType === ARROW && areCoordinatesOnLine(shape, x, y))
  );
};
