import { RECTANGLE } from "./constants.js";

const state = {
  controls: {
    isMousePositionForStartingCoordinates: true,
  },
  canavas: {
    coordinates: {
      x: 0,
      y: 0,
    },
  },
  shapeSelectedToDraw: RECTANGLE,
};

export const store = {
  getState: () => state,
  getControls: () => state.controls,
  getCanvasCoordinates: () => state.canavas.coordinates,
  getShapeSelectedToDraw: () => state.shapeSelectedToDraw,

  setIsMousePositionForStartingCoordinates: (
    isMousePositionForStartingCoordinates
  ) => {
    state.controls.isMousePositionForStartingCoordinates =
      isMousePositionForStartingCoordinates;
  },
  setCanvasCoordinates: (newCoordinates) => {
    state.canavas.coordinates = { ...newCoordinates };
  },
  setShapeSelectedToDraw: (newShape) => {
    state.shapeSelectedToDraw = newShape;
  },
};
