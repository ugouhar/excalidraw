const state = {
  controls: {
    isDrawingEnabled: false,
    isMousePositionForStartingCoordinates: true,
  },
  canavas: {
    coordinates: {
      x: 0,
      y: 0,
    },
  },
};

export const store = {
  getState: () => state,
  getControls: () => state.controls,
  getCanvasCoordinates: () => state.canavas.coordinates,
  setIsDrawingEnabled: (isEnabled) => {
    state.controls.isDrawingEnabled = isEnabled;
  },
  setIsMousePositionForStartingCoordinates: (
    isMousePositionForStartingCoordinates
  ) => {
    state.controls.isMousePositionForStartingCoordinates =
      isMousePositionForStartingCoordinates;
  },
  setCanvasCoordinates: (newCoordinates) => {
    state.canavas.coordinates = { ...newCoordinates };
  },
};
