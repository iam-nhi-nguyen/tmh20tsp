// Daniel Shiffman
// The Coding Train
// Traveling Salesperson with Genetic Algorithm

// https://thecodingtrain.com/CodingChallenges/035.4-tsp.html
// https://youtu.be/M3KTWnTrU_c
// https://thecodingtrain.com/CodingChallenges/035.5-tsp.html
// https://youtu.be/hnxn6DtLYcY

// https://editor.p5js.org/codingtrain/sketches/EGjTrkkf9

function calculateFitness() {
    var currentRecord = Infinity;
    for (var i = 0; i < population.length; i++) {
      var d = calcDistance(vertices, population[i]);
      if (d < recordDistanceGA) {
        recordDistanceGA = d;
        bestEverGA = population[i];
      }
      if (d < currentRecord) {
        currentRecord = d;
        currentBestGA = population[i];
      }
  
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
      mutate(order, 0.1);
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
