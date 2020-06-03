// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for this video: https://youtu.be/9Xy-LMAfglE

// Declare variables //

// Vertices
var vertices = [];
var totalVertices = 15;

// Set up variables
var rate = 5;

var panelWidth = 500;
var panelHeight = 300;

var padding = 70;

var backgroundColor = 220;

var radiusResult = 10;
var radiusProcess = 5;

var startColorResult = "rgb(255, 255, 0)";
var verticesColorResult = "rgb(0, 0, 255)";

var pathColorResult = "rgb(255, 0, 0)";
var pathWeightResult = 2;

var processColor = 0;
var pathWeightProcess = 1;

var titleSize = 25;
var bodySize = 20;

var titleColor = 0;
var bodyColor = 0;

// Bruce force
var order = [];

var totalPermutations;
var count = 0;

var recordDistance;
var bestEver;

// Greedy
var currentVertex;
var remainVertices = [];

var path = [];

// Genetic
var popSize = 500;
var population = [];
var fitness = [];

var recordDistanceGA = Infinity;
var bestEverGA;
var currentBestGA;

var statusP;

// Set up //
function setup() {
  createCanvas(2*panelWidth, 3*panelHeight);
  var orderGA = [];

  // Get random vertices
  for (var i = 0; i < totalVertices; i++) {
    var v = createVector(random(panelWidth - 2*padding), random(panelHeight - 2*padding));
    vertices[i] = v;
    order[i] = i;
    orderGA[i] = i;
  }

  // Bruce force
  var d = calcDistance(vertices, order);
  recordDistance = d;
  bestEver = order.slice();

  totalPermutations = factorial(totalVertices - 1);

  // Greedy
  currentVertex = vertices[0];
  remainVertices = vertices.slice(1);
  path[0] = vertices[0];

  // Genetic
  for (var i = 0; i < popSize; i++) {
    population[i] = customShuffle(orderGA, orderGA[0]);
    console.log(population[i]);
  }
  statusP = createP('').style('font-size', '32pt');
}

// Draw //
function draw() {
  background(backgroundColor);
  frameRate(rate);
  
  // Bruce force //

  // Result panel
  translate(padding, padding);

  textSize(titleSize);
  fill(titleColor);
  text('Vét cạn', - titleSize, - titleSize);

  fill(startColorResult);
  ellipse(vertices[0].x, vertices[0].y, radiusResult, radiusResult);
  fill(verticesColorResult);
  for (var i = 1; i < totalVertices; i++) {
    ellipse(vertices[i].x, vertices[i].y, radiusResult, radiusResult);
  }

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

  fill(processColor);
  for (var i = 0; i < totalVertices; i++) {
    ellipse(vertices[i].x, vertices[i].y, radiusProcess, radiusProcess);
  }

  var d = calcDistance(vertices, order);
  if (d < recordDistance) {
    recordDistance = d;
    bestEver = order.slice();
  }

  textSize(bodySize);
  fill(bodyColor);
  var percent = 100 * ((count + 1) / totalPermutations);
  text(nf(percent, 0, 2) + '% hoàn thành', 0, -bodySize);
  text('Độ dài: ' + nf(recordDistance, 0, 2) + ' px', 0, -2*bodySize);

  nextOrder();

  // Greedy //

  // Result panel
  translate(- panelWidth, panelHeight);

  textSize(titleSize);
  fill(titleColor);
  text('Tham lam', - titleSize, - titleSize);

  fill(startColorResult);
  ellipse(vertices[0].x, vertices[0].y, radiusResult, radiusResult);
  fill(verticesColorResult);
  for (var i = 1; i < totalVertices; i++) {
    ellipse(vertices[i].x, vertices[i].y, radiusResult, radiusResult);
  }

  stroke(pathColorResult);
  strokeWeight(pathWeightResult);
  noFill();
  beginShape();
  for (var i = 0; i < path.length; i++){    
    vertex(path[i].x, path[i].y);
  }
  endShape();

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
  strokeWeight(0);

  currentVertex = remainVertices[0];
  if (remainVertices.length > 1){
    remainVertices.shift();
  }

  // Process panel
  translate(panelWidth, 0);

  textSize(bodySize);
  fill(bodyColor);
  var dpath = calcDistancePath(path);
  if (remainVertices.length <= 1){
    var percentOptimal = 100 * (recordDistance / dpath);
    text(nf(percentOptimal, 0, 2) + '% tối ưu', 0, -bodySize);
  }
  text('Độ dài: ' + nf(dpath, 0, 2) + ' px', 0, -2*bodySize);

  // Genetic //

  // GA
  calculateFitness();
  normalizeFitness();
  nextGeneration();

  // Result panel
  translate(-panelWidth, panelHeight);
  
  textSize(titleSize);
  fill(titleColor);
  text('Di truyền', - titleSize, - titleSize);

  fill(startColorResult);
  ellipse(vertices[0].x, vertices[0].y, radiusResult, radiusResult);
  fill(verticesColorResult);
  for (var i = 1; i < totalVertices; i++) {
    ellipse(vertices[i].x, vertices[i].y, radiusResult, radiusResult);
  }

  stroke(pathColorResult);
  strokeWeight(pathWeightResult);
  noFill();
  beginShape();
  for (var i = 0; i < bestEverGA.length; i++) {
    var n = bestEverGA[i];
    vertex(vertices[n].x, vertices[n].y);
  }
  endShape();

  // Process pane;
  translate(panelWidth, 0);

  stroke(processColor);
  strokeWeight(pathWeightProcess);
  noFill();
  beginShape();
  for (var i = 0; i < currentBestGA.length; i++) {
    var n = currentBestGA[i];
    vertex(vertices[n].x, vertices[n].y);
  }
  endShape();
  strokeWeight(0);
  
  fill(processColor);
  beginShape();
  for (var i = 0; i < totalVertices; i++) {
    ellipse(vertices[i].x, vertices[i].y, radiusProcess, radiusProcess);
  }
  endShape();

  textSize(bodySize);
  fill(bodyColor);
  var percentOptimalGA = 100 * (recordDistance / recordDistanceGA);
  text(nf(percentOptimalGA, 0, 2) + '% tối ưu', 0, -bodySize);
  text('Độ dài: ' + nf(recordDistanceGA, 0, 2) + ' px', 0, -2*bodySize);
}

// Helper functions //
function factorial(n) {
  if (n == 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function customShuffle(array, first) {
  const updatedArray = shuffle(array).filter(item => item !== first);
  return [first, ...updatedArray];
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
  count++;

  // STEP 1 of the algorithm
  // https://www.quora.com/How-would-you-explain-an-algorithm-that-generates-permutations-using-lexicographic-ordering
  var largestI = -1;
  for (var i = 1; i < order.length - 1; i++) {
    if (order[i] < order[i + 1]) {
      largestI = i;
    }
  }
  if (largestI == -1) {
    noLoop();
    console.log('finished');
  }

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
  if (remainVertices.length > 0){
      var bestNeighbor = 0;
      var bestDistance = dist(currentVertex.x, currentVertex.y, remainVertices[0].x, remainVertices[0].y);
      var d;
      for (var i = 1; i < remainVertices.length; i++){
          d = dist(currentVertex.x, currentVertex.y, remainVertices[i].x, remainVertices[i].y);
         if (d < bestDistance){
              bestDistance = d;
              bestNeighbor = i;
          }
      }
      swap(remainVertices, 0, bestNeighbor);
  }
}
