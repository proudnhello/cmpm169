// sketch.js - Lightning Matrix
// Author: Moore Macauley
// Date: 1/18/2025
// WARNING: flashing lights

var G_SIZE = 50
var G_STROKE_SIZE = 25
var G_STROKE_WEIGHT = 5
var G_WIDTH = 1200
var G_HEIGHT = 800

var G_MARGIN = 40
var G_DELAY = 5
var G_LIFESPAN = 10

var G_COLOR_PT
var G_COLOR_BG
var G_LINE_R = 206
var G_LINE_G = 194
var G_LINE_B = 39

var G_NOISE_FREQ = G_SIZE/15
var G_NOISE_MAX = G_SIZE/2

var G_POINTS_AWAY = 1

var G_ELLIPSE_WIDTH = G_SIZE/5
var G_ELLIPSE_COUNT = 10
var G_ELLIPSE_SIZE_INCREMENT = 1.3
var G_ELLIPSE_ALPHA_RECDUCTION = 1.5
var G_ELLIPSE_ALPHA_STEP = 5

var G_RENDERING = false

// Represents and creates squares of dots
class Square{
  
  // The x and y location of the top left dot
  constructor(x, y){
    this.x = x
    this.y = y
    this.points = [[x, y], [x+G_SIZE, y], [x, y+G_SIZE], [x+G_SIZE, y+G_SIZE]]
    this.possibleConnections = this.points.slice()
    for(let i = x - G_SIZE * G_POINTS_AWAY; i <= x + G_SIZE * (G_POINTS_AWAY + 1); i += G_SIZE){
      for(let j = y - G_SIZE * G_POINTS_AWAY; j <= y + G_SIZE * (G_POINTS_AWAY + 1); j += G_SIZE){
        this.possibleConnections.push([i, j])
      }
    }
    this.delay = Math.floor(Math.random() * G_DELAY)
    this.l = null
  }
  // Square render function
  render(){
    strokeWeight(G_STROKE_WEIGHT)
    stroke(G_COLOR_PT);
    this.points.forEach(function(p){
      point(p[0], p[1])
    })
    if(this.l){
      this.l.render()
    }
    this.delay -= 1
    if (this.delay > 0){
      return
    }
    
    let start = this.points[Math.floor(Math.random() * this.points.length)]
    let temp = this.possibleConnections.filter(p=> p != start)
    let end = temp[Math.floor(Math.random() * temp.length)]
    this.l = new Line(start, end)
    this.delay = Math.floor(Math.random() * G_DELAY) + G_LIFESPAN
  }
}

class Line{
  constructor(p1, p2){
    this.p1 = p1
    this.p2 = p2
    this.angle = -1
    this.length = -1
    this.lifespan = G_LIFESPAN
    this.lightA = 200
    this.noisePoints = []
    // Start by finding the angle between the vector made by the points and the x axis
    this.angle = Math.atan2(p1[1] - p2[1], p1[0] - p2[0])
    let xLength = p1[0] - p2[0]
    let yLength = p1[1] - p2[1]
    this.length = Math.ceil(Math.sqrt(xLength*xLength + yLength*yLength))
    this.initialEllipseSize = this.length * 0.4

    push()
    translate(p1[0], p1[1])
    rotate(this.angle)
    
    for(let i = 0; i <= this.length; i+=G_NOISE_FREQ){
      let n = (noise(i, frameCount)-0.5) * 2 * (G_NOISE_MAX)
      let p = [i, n]
      this.noisePoints.push(p)
    }
    this.noisePoints[0] = [0, 0]
    this.noisePoints[1] = [0, 0]
    this.noisePoints[this.noisePoints.length-1] = [this.length, 0]
    this.noisePoints[this.noisePoints.length-2] = [this.length, 0]
    
    pop()
  }
  
  render(){
    push()
    translate(this.p1[0], this.p1[1])
    rotate(this.angle)
    
    let a = map(this.lifespan, 0, G_LIFESPAN, 0, 255)
    
    this.lightA = this.lightA/G_ELLIPSE_ALPHA_RECDUCTION
    let currentLightA = this.lightA
    let currentEllipseWidth = G_ELLIPSE_WIDTH
    let currentEllipseSize = this.initialEllipseSize
    noStroke()
    
    for(let i = 0; i < G_ELLIPSE_COUNT; i++){
      let c = color(255, 255, 255, currentLightA)
      fill(c)
      ellipse(this.length/2, 0, currentEllipseSize, currentEllipseWidth)
      currentEllipseSize *= G_ELLIPSE_SIZE_INCREMENT
      currentEllipseWidth *= G_ELLIPSE_SIZE_INCREMENT
      currentLightA /= G_ELLIPSE_ALPHA_RECDUCTION
    }
    
    let c = color(G_LINE_R, G_LINE_G, G_LINE_B, a);
    strokeWeight(G_STROKE_WEIGHT/2)
    stroke(c);
    fill(0, 0)
    this.lifespan -= 1
    beginShape()
    this.noisePoints.forEach(function(p){
      curveVertex(p[0], p[1])
    })
    endShape()
    
    
    pop()
  }
}

var squares = [];
function setup() {
  setAttributes("alpha", true)
  G_COLOR_PT = color(240,235,235, 255)
  G_COLOR_LINE = color(206,194,39, 255)
  G_COLOR_BG = color(0,0,0, 255)
  createCanvas(1200, 800);
  strokeWeight(G_STROKE_WEIGHT)
  
  for(let x = G_MARGIN; x < G_WIDTH-(G_MARGIN+G_SIZE); x += G_SIZE){
     squares[x] = []
     for(let y = G_MARGIN; y < G_HEIGHT-(G_MARGIN+G_SIZE); y += G_SIZE){
       squares[x][y] = new Square(x, y)
     }
  }
  // squares = [[new Square(100, 100)]]
}

function keyPressed(){
  if (key === " "){
    G_RENDERING = true
  }
}

function draw() {
  background(G_COLOR_BG);
  if(G_RENDERING){
    squares.forEach(function(l){
      l.forEach(function(s){
        s.render()
      })
    })
  }else{
    fill(255)
    textAlign(CENTER, CENTER)
    stroke
    text("FLASHING LIGHTS WARNING\n Press Space to play", G_WIDTH/2, G_HEIGHT/2)
  }
}