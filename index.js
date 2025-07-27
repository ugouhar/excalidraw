const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let prevWidth = 0;
let prevHeight = 0;
function drawRectangle(event) {
  const x_coord_start = 10;
  const y_coord_start = 10;
  ctx.clearRect(x_coord_start, y_coord_start, prevWidth, prevHeight);
  ctx.clearRect(
    x_coord_start - 1,
    y_coord_start - 1,
    prevWidth + 2,
    prevHeight + 2
  );

  const rectangle = new Path2D();
  const width = event.clientX;
  const height = event.clientY;
  rectangle.rect(x_coord_start, y_coord_start, width, height);
  ctx.stroke(rectangle);
  prevWidth = width;
  prevHeight = height;
}

canvas.addEventListener("click", drawRectangle);
