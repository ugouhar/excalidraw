import { store } from "../store.js";

export const insideRectangle = (rectangle, x, y) => {
  const delta = store.getBrushSize() / 2 + 2;

  const insideWidth =
    x >= rectangle.x - delta && x <= rectangle.x + rectangle.w + delta;

  const insideHeight =
    y >= rectangle.y - delta && y <= rectangle.y + rectangle.h + delta;

  return insideWidth && insideHeight;
};
