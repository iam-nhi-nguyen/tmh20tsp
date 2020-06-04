// Nhi Nguyen
// Based from code of Daniel Shiffman for this video https://youtu.be/9Xy-LMAfglE

// Declare variables //

// Vertices
var vertices = [];
var totalVertices = 7;

// Set up variables
var frameRate = 10;

var panelWidth = 390;
var panelHeight = 250;

var padding = 50;

var backgroundColor = 220;

var radiusResult = 10;
var radiusProcess = 5;

var startColorResult = "rgb(255, 255, 0)";
var verticesColorResult = "rgb(0, 0, 255)";

var pathColorResult = "rgb(255, 0, 0)";
var pathWeightResult = 2;

var processColor = 0;
var pathWeightProcess = 1;

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

// Greedy
var currentVertex;
var remainVertices = [];

var path = [];
var countGR = 0;

// Genetic
var popSize = 500;
var population = [];
var fitness = [];

var generation;
var recordDistanceGA = Infinity;
var bestEverGA;
var currentBestGA;

var mutationRate = 0.1;
var countGA;

var statusP;

var indexPopulation;

// Helper
var factorial = [1];
for (var i = 1; i < 21; i++){
  factorial[i] = factorial[i-1]*i;
}

// Set up //
function setup() {
  createCanvas(3*panelWidth, 2*panelHeight);
  var orderGA = [];

  vertices = [];
  order = [];
  totalVertices = document.getElementById('numVer').value;

  // Get random vertices
  for (var i = 0; i < totalVertices; i++) {
    var v = createVector(random(panelWidth - 2*padding), random(panelHeight - 2*padding));
    vertices[i] = v;
    order[i] = i;
    orderGA[i] = i;
  }

  // Bruce force
  count = 0;

  var d = calcDistance(vertices, order);
  recordDistance = d;
  bestEver = order.slice();

  totalPermutations = factorial[totalVertices-1];
  //console.log(totalPermutations);

  // Greedy
  path = [];

  currentVertex = vertices[0];
  remainVertices = vertices.slice(1);
  path[0] = vertices[0];

  // Genetic
  population = [];
  fitness = [];
  recordDistanceGA = Infinity;

  generation = document.getElementById('numGen').value;;
  popSize = document.getElementById('sizePop').value;

  for (var i = 0; i < popSize; i++) {
    population[i] = customShuffle(orderGA, orderGA[0]);
    //console.log(population[i]);
  }
  statusP = createP('').style('font-size', '32pt');

  mutationRate = document.getElementById('rateMut').value;
  indexPopulation = 0;
  countGA = 0;

  totalCountGA = (totalVertices-1)*generation*popSize;

  draw();
}

// Draw //
function draw() {
  background(backgroundColor);
  frameRate(frameRate);
  
  // Bruce force //

  // Result panel
  translate(padding, padding);

  textSize(titleSize);
  fill(titleColor);
  text('Vét cạn', - titleSize, - titleSize);

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
  translate(0, panelHeight);
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
  text('Độ dài: ' + nf(recordDistance, 0, 2) + ' px', 0, -2*bodySize);
  text(nf(percent, 0, 2) + '% hoàn thành; ' + nf((count + 1)*(totalVertices - 1)) + ' phép tính', 0, -bodySize);

  nextOrder();

  // Greedy //

  // Result panel
  translate(panelWidth, - panelHeight);

  textSize(titleSize);
  fill(titleColor);
  text('Tham lam', - titleSize, - titleSize);

  drawVertices(startColorResult, verticesColorResult, radiusResult);

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
  translate(0, panelHeight);

  textSize(bodySize);
  fill(bodyColor);
  var dpath = calcDistancePath(path);
  if (remainVertices.length <= 1){
    var percentOptimal = 100 * (recordDistance / dpath);
    text('Độ dài: ' + nf(dpath, 0, 2) + ' px; ' + nf(percentOptimal, 0, 2) + '% tối ưu', 0, -2*bodySize);
  }
  text(nf(countGR) + ' phép tính', 0, -bodySize);

  // Genetic //

  // GA
  if (generation > 0){
    if (indexPopulation == 0){
      calculateFitness();
      normalizeFitness();
      nextGeneration();
      generation --;
    }
  }
  //console.log(bestEverGA);
  //console.log(currentBestGA);

  // Result panel
  translate(panelWidth, - panelHeight);
  
  textSize(titleSize);
  fill(titleColor);
  text('Di truyền', - titleSize, - titleSize);

  drawVertices(startColorResult, verticesColorResult, radiusResult);

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
  translate(0, panelHeight);

  if (generation >= 0){
    if (generation == 0 && indexPopulation == popSize){generation --;}
    if (indexPopulation < popSize){
      countGA += totalVertices - 1;
  
      stroke(processColor);
      strokeWeight(pathWeightProcess);
      noFill();
      beginShape();
      for (var i = 0; i < population[indexPopulation].length; i++) {
        var n = population[indexPopulation][i];
        vertex(vertices[n].x, vertices[n].y);
      }
      endShape();
  
      indexPopulation ++;
    }
    else{
      indexPopulation = 0;
    }
  }
  else{
    stroke(processColor);
    strokeWeight(pathWeightProcess);
    noFill();
    beginShape();
    for (var i = 0; i < bestEverGA.length; i++) {
      var n = bestEverGA[i];
      vertex(vertices[n].x, vertices[n].y);
    }
    endShape();
  }
    

  strokeWeight(0);
  
  drawVertices(processColor, processColor, radiusProcess);

  textSize(bodySize);
  fill(bodyColor);
  var percentOptimalGA = 100 * (recordDistance / recordDistanceGA);
  var percentGA = 100 * (countGA / totalCountGA);
  text('Độ dài: ' + nf(recordDistanceGA, 0, 2) + ' px; ' + nf(percentOptimalGA, 0, 2) + '% tối ưu', 0, -2*bodySize);
  text(nf(percentGA, 0, 2) + '% hoàn thành; ' + nf(countGA) + ' phép tính', 0, -bodySize);
}

function drawVertices(fillColorStart, fillColor, radius){
  fill(fillColorStart);
  ellipse(vertices[0].x, vertices[0].y, radius, radius);
  fill(fillColor);
  for (var i = 1; i < totalVertices; i++) {
    ellipse(vertices[i].x, vertices[i].y, radius, radius);
  }
}

// Helper functions //
/*
function factorial(n) {
  if (n == 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
*/

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

// Genetic

function calculateFitness() {
  //var currentRecord = Infinity;
  for (var i = 0; i < population.length; i++) {
    var d = calcDistance(vertices, population[i]);
    if (d < recordDistanceGA) {
      recordDistanceGA = d;
      bestEverGA = population[i];
      //console.log(recordDistanceGA);
    }
    /*
    if (d < currentRecord) {
      currentRecord = d;
      currentBestGA = population[i];
      //console.log(currentRecord);
    }
    */

    // This fitness function has been edited from the original video
    // to improve performance, as discussed in The Nature of Code 9.6 video,
    // available here: https://www.youtube.com/watch?v=HzaLIO9dLbA
    fitness[i] = 1 / (pow(d, 8) + 1);
  }
}

function normalizeFitness() {
  var sum = 0;
  for (var i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (var i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}

function nextGeneration() {
  var newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    var orderA = pickOne(population, fitness);
    var orderB = pickOne(population, fitness);
    var order = crossOver(orderA, orderB);
    mutate(order, mutationRate);
    newPopulation[i] = order;
  }
  population = newPopulation;
}

function pickOne(list, prob) {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(orderA, orderB) {
  var start = floor(random(1, orderA.length));
  var end = floor(random(start + 1, orderA.length));
  var neworder = []
  neworder[0] = 0;
  neworder.concat(orderA.slice(start, end));
  for (var i = 0; i < orderB.length; i++) {
    var vertex = orderB[i];
    if (!neworder.includes(vertex)) {
      neworder.push(vertex);
    }
  }
  return neworder;
}

function mutate(order, mutationRate) {
  for (var i = 0; i < totalVertices; i++) {
    if (random(1) < mutationRate) {
      var indexA = floor(random(1, order.length - 1));
      var indexB = (indexA + 1);
      swap(order, indexA, indexB);
    }
  }
}
