// sketch.js - purpose and description here
// Author: Moore Macauley
// Date: 1/30/2025

// Based on Filter by angletapes
// https://openprocessing.org/sketch/1800102

var sinOsc, sinFilter, reverb, reverbTime, reverbDecay;
let bNoise;
let makingNoise = false;
let delay;
let framesPerCircle = 10 

let alphaChange = 1/100
let radiusChange = 1/50

let setFreq, occilatorFreq

let drops = []

class drop{
  constructor(x, y){
    this.x = x
    this.y = y
    this.setFreq = setFreq
    this.occilatorFreq = occilatorFreq
    this.currentAlpha = 255
    this.currentRadius = 0
  }
  
  render(){
    this.currentAlpha -= this.occilatorFreq * alphaChange
    this.currentRadius += this.setFreq * radiusChange
    
    if(this.currentAlpha <= 0){
      drops.splice(drops.indexOf(this), 1)
    }
    
    stroke(255, 255, 255, this.currentAlpha)
    circle(this.x, this.y, this.currentRadius)
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let smaller = canvasContainer.width() < canvasContainer.height() ? canvasContainer.width() : canvasContainer.height();
  let canvas = createCanvas(smaller, smaller);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  background(0, 0, 0);
  noFill();
  stroke(255,255,255)
  strokeWeight(5)

  print(p5)
  sinFilter = new p5.Filter();
  sinFilter.setType("bandpass")
  console.log(sinFilter)

  //right button oscillator
  sinOsc = new p5.Oscillator('square');
  sinOsc.amp(0);
  sinOsc.freq(200);
  sinOsc.start();
  sinOsc.disconnect();
  sinOsc.connect(sinFilter);

  //reverb for sinOsc
  reverb = new p5.Reverb();
  reverb.set(2)
  reverb.amp(1)
  sinOsc.connect(reverb)
  
  bNoise = new p5.Noise("brown")
  bNoise.amp(0.5)
  bNoise.connect()
  bNoise.start()
  
  delay = new p5.Delay()
  delay.delayTime(0.5)
  delay.feedback(0.5)
  sinOsc.connect(delay)
}

function draw() {
  background(0,0,0)
  setFreq = map(mouseX, 0, windowWidth, 50, 500);
  setFreq = constrain(setFreq, 0, 22050);
  // let setFreq = (mouseX);
  sinFilter.freq(setFreq);
  occilatorFreq = map(mouseY, 0, windowHeight, 50, 500)
  sinOsc.freq(occilatorFreq)
  // give the filter a narrow band (lower res = wider bandpass)
  sinFilter.res(5);//50
  
  applyReverb()
  applyBrown()
  applyDelay()
  
  if(makingNoise){
    drops.push(new drop(mouseX, mouseY))
  }
  
  drops.forEach((function(drop){
    drop.render()
  }))
}

function applyReverb(){
  let cornerX = 0
  let cornerY = 0
  let centerX = windowWidth/2
  let centerY = windowHeight/2
  let maxReverbAmp = 1
  let distToMouse = Math.sqrt(
    (mouseX - cornerX) * (mouseX - cornerX) + 
    (mouseY - cornerY) * (mouseY - cornerY)
  ) 
  let distToCenter = Math.sqrt(
    (cornerX - centerX) * (cornerX - centerX) + 
    (cornerY - centerY) * (cornerY - centerY)
  ) 
  // If we are not in the corner specified, change set and amp to 0
  if(distToMouse > distToCenter){
    reverb.amp(0)
    return
  }
  let ratio = distToMouse/distToCenter
  let rAmp = map(ratio, 1, 0, 0, maxReverbAmp)
  reverb.amp(rAmp)
}
  
function applyBrown(){
  let cornerX = 0
  let cornerY = windowHeight
  let centerX = windowWidth/2
  let centerY = windowHeight/2
  let maxAmp = 0.5
  let distToMouse = Math.sqrt(
    (mouseX - cornerX) * (mouseX - cornerX) + 
    (mouseY - cornerY) * (mouseY - cornerY)
  ) 
  let distToCenter = Math.sqrt(
    (cornerX - centerX) * (cornerX - centerX) + 
    (cornerY - centerY) * (cornerY - centerY)
  ) 
  // If we are not in the corner specified, change set and amp to 0
  if(distToMouse > distToCenter || !makingNoise){
    bNoise.amp(0)
    return
  }
  let ratio = distToMouse/distToCenter
  let rAmp = map(ratio, 1, 0, 0, maxAmp)
  bNoise.amp(rAmp)
} 
  
function applyDelay(){
  let cornerX = windowWidth
  let cornerY = 0
  let centerX = windowWidth/2
  let centerY = windowHeight/2
  let maxAmp = 1
  let distToMouse = Math.sqrt(
    (mouseX - cornerX) * (mouseX - cornerX) + 
    (mouseY - cornerY) * (mouseY - cornerY)
  ) 
  let distToCenter = Math.sqrt(
    (cornerX - centerX) * (cornerX - centerX) + 
    (cornerY - centerY) * (cornerY - centerY)
  ) 
  // If we are not in the corner specified, change set and amp to 0
  if(distToMouse > distToCenter || !makingNoise){
    delay.amp(0)
    return
  }
  let ratio = distToMouse/distToCenter
  let rAmp = map(ratio, 1, 0, 0, maxAmp)
  delay.amp(rAmp)
}

function touchStarted(){
  userStartAudio();
  sinOsc.amp(0.8);
  makingNoise = true
}
//reverb.decayTime
function mouseDragged(){
  userStartAudio();
  sinOsc.amp(0.8);
  makingNoise = true
}

function touchEnded(){
  sinOsc.amp(0)
  makingNoise = false
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  let smaller = canvasContainer.width() < canvasContainer.height() ? canvasContainer.width() : canvasContainer.height();
  console.log("New size: " + smaller);
  resizeCanvas(smaller, smaller); 
  // redrawCanvas(); // Redraw everything based on new size
}