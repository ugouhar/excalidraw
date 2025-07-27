const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const prevSize = {
  width: 0,
  height: 0,
};

const controls = {
  isDrawingEnabled: false,
  isMousePositionForStartingCoordinates: true,
};

const startCoord = {
  x: 0,
  y: 0,
};

function drawRectangle(event) {
  if (!controls.isDrawingEnabled) return;
  if (controls.isMousePositionForStartingCoordinates) {
    startCoord.x = event.clientX;
    startCoord.y = event.clientY;
    controls.isMousePositionForStartingCoordinates = false;
  }

  ctx.clearRect(startCoord.x, startCoord.y, prevSize.width, prevSize.height);
  ctx.clearRect(
    startCoord.x - 1,
    startCoord.y - 1,
    prevSize.width + 2,
    prevSize.height + 2
  );

  const rectangle = new Path2D();
  const width = event.clientX - startCoord.x;
  const height = event.clientY - startCoord.y;
  rectangle.rect(startCoord.x, startCoord.y, width, height);
  ctx.stroke(rectangle);
  prevSize.width = width;
  prevSize.height = height;
}

const canvasMousedownHandler = () => {
  controls.isDrawingEnabled = true;
};
const canvasMouseUpHandler = () => {
  controls.isDrawingEnabled = false;
  controls.isMousePositionForStartingCoordinates = true;
};

canvas.addEventListener("mousedown", canvasMousedownHandler);
canvas.addEventListener("mouseup", canvasMouseUpHandler);
canvas.addEventListener("mousemove", drawRectangle);
