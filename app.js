//get DOM elements
const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorsBtn = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  toolBtns = document.querySelectorAll(".tool");
const { log } = console;

//global variables with default values
let prevMouseX, prevMouseY, snapshot;
(isDrawing = false),
  (selectedTool = "brush"),
  (brushWidth = 3),
  (selectedColor = "#000");

const setCanvasBg = () => {
  //setting whole canvas bg to white so the downloaded img bg will be white
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  //setting viewable width/height of the canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBg();
});

const drawRect = (e) => {
  //when fillColor isn't checked draw a rect with border else draw rect with bg
  if (!fillColor.checked)
    //creating circle according to the mouse pointer
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );

  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath();
  //arc is used to create a circle passing the x,y,radius, startAngle and endAngle cordinates;
  //getiing radius for circle according to the mouse pointer;
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  //creating first point of line according to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY);
  //creating bottom line of triangle
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  //closing path of a triangle so the third line draw automatically
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; //passing current mouse position as prevMouse
  prevMouseY = e.offsetY; //passing current mouse position as prevMouse
  //create a new path to draw
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  //copying canvas data & passing as snapshot value... this avoids draging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const draw = (e) => {
  if (!isDrawing) return; //if isDrawing is false return from here.

  //adding copied canvas data onto this canvas
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    //if selectedTool is eraser then set strokeStyle to white as to paint on existing canvas content else set stroke color to selected color;
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    //creates a new line ..ctx.lineTo(x-cord, y-cord)
    ctx.lineTo(e.offsetX, e.offsetY);
    //drawing/filling line with color
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else drawTriangle(e);
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    log(selectedTool);
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

colorsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");

    //passing selected btn bg color as selectedColor value;
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  //passing picked color value from picker to last color btn bg
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBg();
});

saveImg.addEventListener("click", () => {
  const s = new Date().getSeconds();
  log(s);
  const link = document.createElement("a");
  link.download = `sketchIT_${s}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
