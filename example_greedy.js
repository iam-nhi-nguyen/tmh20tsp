// Nhi Nguyen
// Based from code of Daniel Shiffman for this video https://youtu.be/9Xy-LMAfglE

// Declare variables //

// Vertices
var vertices = [[1,7],[4,4],[6,0],[2,3],[0,1],[7,4]];
var totalVertices = 6;

// Set up variables
var framerate = 2;

var panelWidth = 580;
var panelHeight = 450;

var padding = 50;

var backgroundColor = 220;

var radiusResult = 12;
var radiusProcess = 6;

var startColorResult = "rgb(255, 255, 0)";
var verticesColorResult = "rgb(0, 0, 255)";

var pathColorResult = "rgb(255, 0, 0)";
var pathWeightResult = 4;

var processColor = 0;
var pathWeightProcess = 2;

var titleSize = 20;
var bodySize = 15;

var titleColor = 0;
var bodyColor = 0;

// Greedy
var currentVertex;
var remainVertices = [];

var path = [];
var countGR;

var totalCountGR;

// Helper
var factorial = [1];
for (var i = 1; i < 21; i++){
  factorial[i] = factorial[i-1]*i;
}

// Set up //
function setup() {
  createCanvas(2*panelWidth, panelHeight);

  // Get random vertices
  for (var i = 0; i < totalVertices; i++) {
    var v = createVector(50*vertices[i][0], 50*vertices[i][1]);
    vertices[i] = v;
  }

  // Greedy
  countGR = 0;
  totalCountGR = (totalVertices-1)*(totalVertices)/2;

  path = [];

  currentVertex = vertices[0];
  remainVertices = vertices.slice(1);
  path[0] = vertices[0];

  draw();
}

// Draw //
function draw() {
  background(backgroundColor);
  frameRate(framerate);

  // Greedy //

  // Result panel
  translate(padding, padding);

  textSize(titleSize);
  fill(titleColor);
  text('Tham lam', - titleSize, - titleSize);

  draw_grid();
  drawVertices(startColorResult, verticesColorResult, radiusResult);

  stroke(pathColorResult);
  strokeWeight(pathWeightResult);
  noFill();
  beginShape();
  for (var i = 0; i < path.length; i++){    
    vertex(path[i].x, path[i].y);
  }
  endShape();

  if(remainVertices != null){
    nearestNeighbor();

    path[path.length] = remainVertices[0];

    stroke(processColor);
    strokeWeight(pathWeightProcess);
    noFill();
    beginShape();
    for (var i = 0; i < remainVertices.length; i++){    
      vertex(currentVertex.x, currentVertex.y);
      vertex(remainVertices[i].x, remainVertices[i].y);
    }
    endShape();

    currentVertex = remainVertices[0];
    if (remainVertices.length > 1){
      remainVertices.shift();
    }
    else{
      remainVertices = null;
    }
  }

  strokeWeight(0);

  // Process panel
  translate(panelWidth, 0);

  textSize(bodySize);
  fill(bodyColor);
  var percentGR = 100 * (countGR / totalCountGR)
  text(nf(percentGR, 0, 2) + '% hoàn thành / ' + nf(totalCountGR, 0, 0) + ' phép tính', 0, -bodySize);

  
  if (remainVertices == null){
    var dpath = calcDistancePath(path);
    text('Độ dài: ' + nf(dpath/50, 0, 2) + ' px; ', 0, -2*bodySize);
  }
}

function drawVertices(fillColorStart, fillColor, radius){
  fill(fillColorStart);
  ellipse(vertices[0].x, vertices[0].y, radius, radius);
  fill(fillColor);
  for (var i = 1; i < totalVertices; i++) {
    ellipse(vertices[i].x, vertices[i].y, radius, radius);
  }
}

function draw_grid(){
    for (var i = 0; i < 8; i++){
        stroke("#888888");
        strokeWeight(1);
        noFill();
        beginShape();
        vertex(50*i, 0);
        vertex(50*i, 50*7);
        endShape();
        beginShape();
        vertex(0, 50*i);
        vertex(50*7, 50*i);
        endShape();
    }
    strokeWeight(0);
}

// Helper functions //
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function customShuffle(array, first) {
  const updatedArray = shuffle(array).filter(item => item !== first);
  return [first, ...updatedArray];
}

// Greedy //

// Path distance
function calcDistancePath(path) {
  var sum = 0;
  for (var i = 0; i < path.length - 1; i++) {
    var d = dist(path[i].x, path[i].y, path[i+1].x, path[i+1].y);
    sum += d;
  }
  return sum;
}

// Nearest neighbor
function nearestNeighbor(){
  if (remainVertices != null){
      console.log(remainVertices.length);
      var bestNeighbor = 0;
      var bestDistance = dist(currentVertex.x, currentVertex.y, remainVertices[0].x, remainVertices[0].y);
      countGR ++;

      var d;
      for (var i = 1; i < remainVertices.length; i++){
        countGR ++;
        d = dist(currentVertex.x, currentVertex.y, remainVertices[i].x, remainVertices[i].y);
        if (d < bestDistance){
          bestDistance = d;
          bestNeighbor = i;
        }
      }
      swap(remainVertices, 0, bestNeighbor);
  }
}