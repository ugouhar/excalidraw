const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let prevWidth = 0;
let prevHeight = 0;
let isDrawingEnabled = false;
let isMousePositionForStartingCoordinates = true;
let x_coord_start = 0;
let y_coord_start = 0;

function drawRectangle(event) {
  if (!isDrawingEnabled) return;
  if (isMousePositionForStartingCoordinates) {
    x_coord_start = event.clientX;
    y_coord_start = event.clientY;
    isMousePositionForStartingCoordinates = false;
  }

  ctx.clearRect(x_coord_start, y_coord_start, prevWidth, prevHeight);
  ctx.clearRect(
    x_coord_start - 1,
    y_coord_start - 1,
    prevWidth + 2,
    prevHeight + 2
  );

  const rectangle = new Path2D();
  const width = event.clientX - x_coord_start;
  const height = event.clientY - y_coord_start;
  rectangle.rect(x_coord_start, y_coord_start, width, height);
  ctx.stroke(rectangle);
  prevWidth = width;
  prevHeight = height;
}
canvas.addEventListener("mousedown", () => (isDrawingEnabled = true));
canvas.addEventListener("mouseup", () => {
  isDrawingEnabled = false;
  isMousePositionForStartingCoordinates = true;
});
canvas.addEventListener("mousemove", drawRectangle);
