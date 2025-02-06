// project.js - purpose and description here
// Author: Moore Macauley
// Date: 2/5/2025

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  cam = createCamera()
  cam.ortho()
  cam.lookAt(0, 0, 0)
  triangles.push(new Penrose(0,0,0))
}

function draw() {
  background(220);
  
  triangles.forEach(function(tri){
    tri.drawPenrose()
  })
  
  // a
  if(keyIsDown(68)){
    cam.move(camSpeed, 0, 0)
  }
  // d
  if(keyIsDown(65)){
    cam.move(-camSpeed, 0, 0)
  }
  // w
  if(keyIsDown(87)){
    cam.move(0, -camSpeed, 0)
  }
  // s
  if(keyIsDown(83)){
    cam.move(0, camSpeed, 0)
  }
  // r
  if(keyIsDown(82)){
    cam.move(0, 0, camSpeed)
  }
  if(keyIsDown(70)){
    cam.move(0, 0, -camSpeed)
  }
}

let boxLength = 150 
let boxWidth = 25
let ajustment = boxLength/2 - boxWidth/2
let halfAjustment = boxLength/4 - boxWidth/2

let cam;
let camX = 800;
let camY = 0;
let camZ = 0;

let camSpeed = 5
let camRotation = 0.002

let triangles = []

let previousX = -1
let previousY = -1
let pan = 0
let tilt = 0

class Penrose{
  constructor(x, y, z){
    this.x = 0
    this.y = 0
    this.z = -1000
    this.pan = pan
    this.tilt = tilt
    this.camX = cam.eyeX
    this.camY = cam.eyeY
    this.camZ = cam.eyeZ
  }
  
  drawPenrose(){
    push()
    translate(this.camX, this.camY, this.camZ)
    rotateY(this.tilt)
    rotateX(this.pan)
    translate(this.x, this.y, this.z)
    rotateX(54.736 * (PI/180))
    rotateZ(45 * (PI/180))
    // Draw the top box
    box(boxLength, boxWidth, boxWidth)
    push()
      translate(ajustment, ajustment, 0)
      push()
        rotateZ(90 * (PI/180))
        // Draw the bottom box 
        box(boxLength, boxWidth, boxWidth)
      pop()
      // Draw the first left box, coming up from the bottom box
      // Use the clip to remove it
      clip(function(){
        translate(-ajustment, -ajustment, 0)
        translate(-ajustment, 0, -halfAjustment)
        rotateY(90 * (PI/180))
        box(boxLength/2 * 0.9, boxWidth, boxWidth)
        translate(ajustment, ajustment, 0)
      }, {invert:true})
      translate(0, ajustment, boxLength/3.8 - boxWidth/2)
      rotateY(90 * (PI/180))
      box(boxLength/1.9, boxWidth, boxWidth)
    pop()
    // Draw the second left box, coming down from the top box
    push()
      translate(-ajustment, 0, -halfAjustment)
      rotateY(90 * (PI/180))
      box(boxLength/2, boxWidth, boxWidth)
    pop()
    pop()
  }
}
function mouseDragged(){
  // Ignore the mouse movement of each camera
  if(previousX === -1 && previousY === -1){
    previousX = mouseX
    previousY = mouseY
    return
  }
  let xDiff = mouseX-previousX
  let yDiff = previousY-mouseY
      
  tilt += xDiff * camRotation
  pan += yDiff * camRotation
  
  // Equasions determined by chatGPT, implementation by me
  let newX = -800 * cos(pan) * sin(tilt)
  let newY = 800 * sin(pan)
  let newZ = -800 * cos(pan) * cos(tilt)
  
  newX += cam.eyeX
  newY += cam.eyeY
  newZ += cam.eyeZ
  
  cam.lookAt(newX, newY, newZ)
  
  previousX = mouseX
  previousY = mouseY
}
  
function mouseReleased(){
  previousX = -1
  previousY = -1
}

function keyPressed(){
  if(key == "e"){
    triangles.push(new Penrose(cam.centerX, cam.centerY, cam.centerZ))
  }
}
