//initial references
let colorsRef = document.getElementsByClassName("colors");
let canvas = document.getElementById("canvas");
let backgroundButton = document.getElementById("color-background");
let colorButton = document.getElementById("color-input");
let clearButton = document.getElementById("button-clear");
let eraseButton = document.getElementById("button-eraser");
let penButton = document.getElementById("button-pen");
let penSize = document.getElementById("pen-slider");
let toolType = document.getElementById("tool-type");

//eraser = false and drawing = false initially
//as user hasn't started using both
let eraserBoolean = false;
let drawingBoolean = false;

//context for canvas
let context = canvas.getContext("2d");

//initially mouse X and Y positions are 0
let mouseX = 0;
let mouseY = 0;

//get left and top of the canvas
let rectLeft = canvas.getBoundingClientRect().left;
let rectTop = canvas.getBoundingClientRect().top;

//Initial Features
const init = function () {
  context.strokeStyle = "black";
  context.lineWidth = 1;

  //Set Canvas height to parent div height
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  //Set Range Title to pen size
  toolType.innerHTML = "Pen";

  //Set background and color inputs initially
  canvas.style.backgroundColor = "#fff";
  backgroundButton.value = "#fff";
  penButton.value = context.strokeStyle;
};

//Detect Touch Device
const isTouchDevice = function () {
  try {
    //We Try to create TouchEvent (it would fail for desktop and throw error)
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

//Exact X and Y positions of the mouse/touch
const getXY = function (e) {
  mouseX = (!isTouchDevice() ? e.pageX : e.touches?.[0].pageX) - rectLeft;

  mouseY = (!isTouchDevice() ? e.pageY : e.touches?.[0].pageY) - rectTop;
};

//User has stopped Drawing
const stopDrawing = function () {
  context.beginPath();
  drawingBoolean = false;
};

//User has started Drawing
const startDrawing = function (e) {
  //drawing = true
  drawingBoolean = true;
  getXY(e);

  //Start drawing
  context.beginPath();
  context.moveTo(mouseX, mouseY);
};

//Draw on Canvas
const drawOnCanvas = function (e) {
  if (!isTouchDevice()) {
    e.preventDefault();
  }
  getXY(e);

  //if user is drawing
  if (drawingBoolean) {
    //create a line to x and y positions of cursor
    context.lineTo(mouseX, mouseY);
    context.stroke();
    if (eraserBoolean) {
      //destination-out draws new shapes behind the existing canvas content
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }
  }
};

//Mouse down/touch start inside canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("touchstart", startDrawing);

//Start drawing when mouse/touch moves
canvas.addEventListener("mousemove", drawOnCanvas);
canvas.addEventListener("touchmove", drawOnCanvas);

//when mouseClick/ touch stops
//stop drawing and begin a new path
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchend", stopDrawing);

//when mouse leaves the canvas
canvas.addEventListener("mouseleave", stopDrawing);

//Button for pen mode
penButton.addEventListener("click", function () {
  //set range title to pen size
  toolType.innerHTML = "Pen";
  eraserBoolean = false;
});

//Button for eraser mode
eraseButton.addEventListener("click", function () {
  eraserBoolean = true;
  //set range title to eraser size
  toolType.innerHTML = "Eraser";
});

//Adjust Pen Size
penSize.addEventListener("input", function () {
  //set width to range value
  context.lineWidth = penSize.value;
});

//Change color
colorButton.addEventListener("change", function () {
  //set stroke color
  context.strokeStyle = colorButton.value;
});

//Change Background
backgroundButton.addEventListener("input", function () {
  canvas.style.backgroundColor = backgroundButton.value;
});

//Clear Button
clearButton.addEventListener("click", function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.backgroundColor = "#fff";
  backgroundButton.value = "#fff";
});
window.onload = init();
