// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Based on Conway's Game of Life, implemented by Wes Modes
// https://editor.p5js.org/wmodes/sketches/ixuIQcgLi

const width = 75;
const height = 75;
const cellSize = 10;
let grid;
let nextGrid;

const G_UNDERPOP = 2
const G_OVERPOP = 3
const G_REPRO = 3

let G_HEALTHY_DIE_SCALE = 0.05
let G_SPAWN_SCALE = 0.05

let g_noiseCounter = 0
const G_INTERVAL = 0.01

let g_running = true;
let g_org_die_scale = G_HEALTHY_DIE_SCALE
let g_org_spawn_scale = G_SPAWN_SCALE
let g_random = true;
let g_mouseDown = false  
let g_lastX = -1
let g_lastY = -1

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}


function setup() {
  createCanvas(width * cellSize, height * cellSize);
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  background(0);
  grid = create2DArray(width, height);
  nextGrid = create2DArray(width, height);
  // randomly populate grid
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      grid[x][y] = floor(random(2));
    }
  }
  
  console.log("Press p to pause the simulation")
  console.log("Press c to clear the grid")
  console.log("Press r to turn off any random effects")
  console.log("Click and drag to create cells")
}

function draw() {
  // if(!(frameCount < 5)){
  //   return
  // }
  // draw current state of grid
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (grid[x][y] === 1) {
        fill(255);
      } else {
        fill(0);
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
  
  if(g_mouseDown){
    let xIndex = constrain(floor(mouseX/cellSize), 0, width-1)
    let yIndex = constrain(floor(mouseY/cellSize), 0, height-1)
    if(xIndex != g_lastX || yIndex != g_lastY){
      if(grid[xIndex][yIndex] === 0){
        grid[xIndex][yIndex] = 1
      }else{
        grid[xIndex][yIndex] = 0
      }
      g_lastX = xIndex
      g_lastY = yIndex
    }
  }
  
  if(!g_running){
    return
  }
  
  let n = (noise(g_noiseCounter) * 2) - 1
  g_noiseCounter += G_INTERVAL
  // print(G_POP_CHANCE + n)
  // update next grid
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = random()
      let neighbors = countNeighbors(x, y);
      if (grid[x][y] === 1 && (neighbors < G_UNDERPOP || neighbors > G_OVERPOP)) {
        nextGrid[x][y] = 0;
      } else if (grid[x][y] === 0 && neighbors === G_REPRO) {
        nextGrid[x][y] = 1;
      } else if (grid[x][y] === 1){
        // Multiplied by - so it happens in the opposite side of the range as spawning
        if((n*-G_HEALTHY_DIE_SCALE) < r){
          nextGrid[x][y] = 1;
        }else{
          nextGrid[x][y] = 0;
        }
      }else{
        if(G_SPAWN_SCALE * n < r){
          nextGrid[x][y] = 0;
        }else{
          nextGrid[x][y] = 1;
        }
      }
    }
  }
  // update grid
  grid = nextGrid;
  nextGrid = create2DArray(width, height);
}
  
function keyPressed(){
  if(key === 'p'){
    g_running = !g_running
  }
  if(key === 'r'){
    if(g_random){
      g_random = false
      G_HEALTHY_DIE_SCALE = 0
      G_SPAWN_SCALE = 0
    }else{
      g_random = true
      G_HEALTHY_DIE_SCALE = g_org_die_scale
      G_SPAWN_SCALE = g_org_spawn_scale
    }
  }
  if(key === 'c'){
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        grid[x][y] = 0
      }
    }
  }
}
  
function mousePressed(){
  g_mouseDown = true
}
  
function mouseReleased(){
  g_mouseDown = false
}
  
function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + width) % width;
      let row = (y + j + height) % height;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function create2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
