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
};

export const store = {
  getState: () => state,
  getControls: () => state.controls,
  getCanvasCoordinates: () => state.canavas.coordinates,

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
