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

// Set up //
function setup() {
  createCanvas(2*panelWidth, panelHeight);
  var orderGA = [];

  vertices = [[1,7],[4,4],[6,0],[2,3],[0,1],[7,4]];
  // Get random vertices
  for (var i = 0; i < totalVertices; i++) {
    var v = createVector(50*vertices[i][0], 50*vertices[i][1]);
    vertices[i] = v;
    orderGA[i] = i;
  }

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
  frameRate(framerate);

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

  // Result panel
  translate(padding, padding);

  draw_grid();
  
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
  translate(panelWidth, 0);

  draw_grid();

  stroke("#aaaaaa");
  strokeWeight(pathWeightResult);
  noFill();
  beginShape();
  for (var i = 0; i < bestEverGA.length; i++) {
    var n = bestEverGA[i];
    vertex(vertices[n].x, vertices[n].y);
  }
  endShape();

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
  var percentGA = 100 * (countGA / totalCountGA);
  text(nf(percentGA, 0, 2) + '% hoàn thành / ' + nf(totalCountGA) + ' phép tính', 0, -bodySize);

  text('Độ dài: ' + nf(recordDistanceGA/50, 0, 2) + ' đơn vị;', 0, -2*bodySize);
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

// Genetic //

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