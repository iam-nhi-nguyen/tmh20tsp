// Nhi Nguyen
// Based from code of Daniel Shiffman for this video https://youtu.be/9Xy-LMAfglE

// Declare variables //

// Vertices
var vertices = [[1,7],[4,4],[6,0],[2,3],[0,1],[7,4]];
var totalVertices = 6;

// Set up variables
var framerate = 10;

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

// Bruce force
var order = [];

var totalPermutations;
var count = 0;

var recordDistance;
var bestEver;

// Helper
var factorial = [1];
for (var i = 1; i < 21; i++){
  factorial[i] = factorial[i-1]*i;
}

// Set up //
function setup() {
  createCanvas(2*panelWidth, panelHeight);

  order = [];

  // Get random vertices
  for (var i = 0; i < totalVertices; i++) {
    var v = createVector(50*vertices[i][0], 50*vertices[i][1]);
    vertices[i] = v;
    order[i] = i;
  }

  // Bruce force
  count = 0;

  var d = calcDistance(vertices, order);
  recordDistance = d;
  bestEver = order.slice();

  totalPermutations = factorial[totalVertices-1];

  draw();
}

// Draw //
function draw() {
  background(backgroundColor);
  frameRate(framerate);
  
  // Bruce force //

  // Result panel
  translate(padding, padding);

  textSize(titleSize);
  fill(titleColor);
  text('Vét cạn', - titleSize, - titleSize);

  draw_grid();

  drawVertices(startColorResult, verticesColorResult, radiusResult);

  stroke(pathColorResult);
  strokeWeight(pathWeightResult);
  noFill();
  beginShape();
  for (var i = 0; i < bestEver.length; i++) {
    var n = bestEver[i];
    vertex(vertices[n].x, vertices[n].y);
  }
  endShape();

  // Process panel
  translate(panelWidth, 0);
  
  draw_grid();

  stroke(processColor);
  strokeWeight(pathWeightProcess);
  noFill();
  beginShape();
  for (var i = 0; i < order.length; i++) {
    var n = order[i];
    vertex(vertices[n].x, vertices[n].y);
  }
  endShape();
  strokeWeight(0);

  drawVertices(processColor, processColor, radiusProcess);

  var d = calcDistance(vertices, order);
  if (d < recordDistance) {
    recordDistance = d;
    bestEver = order.slice();
  }

  textSize(bodySize);
  fill(bodyColor);
  var percent = 100 * ((count + 1) / totalPermutations);
  if (percent < 0.01) {percent = 0;}
  text('Độ dài: ' + nf(recordDistance / 50, 0, 2) + ' đơn vị', 0, -2*bodySize);
  text(nf(percent, 0, 2) + '% hoàn thành / ' + nf(totalPermutations*(totalVertices - 1)) + ' phép tính', 0, -bodySize);

  nextOrder();
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

// Bruce force //

// Order distance
function calcDistance(points, order) {
  var sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var verticeAIndex = order[i];
    var verticeA = points[verticeAIndex];
    var verticeBIndex = order[i + 1];
    var verticeB = points[verticeBIndex];
    var d = dist(verticeA.x, verticeA.y, verticeB.x, verticeB.y);
    sum += d;
  }
  return sum;
}

// Lexical order
function nextOrder() {
  // STEP 1 of the algorithm
  var largestI = -1;
  for (var i = 1; i < order.length - 1; i++) {
    if (order[i] < order[i + 1]) {
      largestI = i;
    }
  }
  if (largestI == -1) {
    order = order;
    //console.log('finished');
  }
  else{
    count++;

    // STEP 2
    var largestJ = -1;
    for (var j = 1; j < order.length; j++) {
      if (order[largestI] < order[j]) {
        largestJ = j;
      }
    }

    // STEP 3
    swap(order, largestI, largestJ);

    // STEP 4: reverse from largestI + 1 to the end
    var endArray = order.splice(largestI + 1);
    endArray.reverse();
    order = order.concat(endArray);
  }
}