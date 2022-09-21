//get DOM elements
const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  toolBtns = document.querySelectorAll(".tool");
const { log } = console;

//global variables with default values
let prevMouseX,
  prevMouseY,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 3;

window.addEventListener("load", () => {
  //setting viewable width/height of the canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const drawRect = (e) => {
  ctx.strokeRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; //passing current mouse position as prevMouse
  prevMouseY = e.offsetY; //passing current mouse position as prevMouse
  //create a new path to draw
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
};

const draw = (e) => {
  if (!isDrawing) return; //if isDrawing is false return from here.

  if (selectedTool === "brush") {
    //creates a new line ..ctx.lineTo(x-cord, y-cord)
    ctx.lineTo(e.offsetX, e.offsetY);
    //drawing/filling line with color
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    log(selectedTool);
  });
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
