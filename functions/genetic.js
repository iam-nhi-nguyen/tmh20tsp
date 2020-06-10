// Nhi Nguyen
// Traveling Salesman Problem

// Genetic

// Set up
function setupGenetic(){
    orderGA = [];

    for (var i = 0; i < totalVertices; i++) {
        orderGA[i] = i;
    }
    
    population = [];
    fitness = [];
    recordDistanceGA = Infinity;

    generation = document.getElementById('numGen').value;;
    popSize = document.getElementById('sizePop').value;

    for (var i = 0; i < popSize; i++) {
        population[i] = customShuffle(orderGA, orderGA[0]);
    }

    mutationRate = document.getElementById('rateMut').value;
    indexPopulation = 0;
    countGA = 0;

    totalCountGA = (totalVertices-1)*generation*popSize;
}

// Draw functions
function drawGenetic(vertical){   
	if (generation > 0){
		if (indexPopulation == 0){
		calculateFitness();
		normalizeFitness();
		nextGeneration();
		generation --;
		}
    }
    
    drawTitle("Di truyền");

	drawRoute(pathColorResult, pathWeightResult, bestEverGA);

    drawVertices(startColorResult, verticesColorResult, radiusResult);
    
    if(vertical){
        translate(0, panelHeight);
    }
    else{
        translate(panelWidth, 0);
    }

	if (generation >= 0){
		if (generation == 0 && indexPopulation == popSize){
			generation --;
		}
		if (indexPopulation < popSize){
			drawRoute(processColor, pathWeightProcess, population[indexPopulation]);
			
			countGA += totalVertices - 1;
			indexPopulation ++;
		}
		else{
			indexPopulation = 0;
		}
	}
	else{
		drawRoute(processColor, pathWeightProcess, bestEverGA);
	}
	
    drawVertices(processColor, processColor, radiusProcess);
    
    if(mod == "all"){
        var percentOptimalGA = 100 * (recordDistance / recordDistanceGA);
    }
	var percentGA = 100 * (countGA / totalCountGA);

	textSize(bodySize);
    fill(bodyColor);
    if(mod == "all"){
        text('Độ dài: ' + nf(recordDistanceGA, 0, 2) + ' px; ' + nf(percentOptimalGA, 0, 2) + '% tối ưu', 0, -2*bodySize);
    }
    else{
        text('Độ dài: ' + nf(recordDistanceGA, 0, 2) + ' px', 0, -2*bodySize);
    }
    text(nf(percentGA, 0, 2) + '% hoàn thành / ' + nf(totalCountGA) + ' phép tính', 0, -bodySize);
    
    if(vertical){
        translate(panelWidth, - panelHeight);
    }
    else{
        translate(- panelWidth, panelHeight);
    }
}

// Fitness functions
function calculateFitness(){
    //var currentRecord = Infinity;
    for (var i = 0; i < population.length; i++){
        var d = calcDistance(vertices, population[i]);
        if (d < recordDistanceGA){
            recordDistanceGA = d;
            bestEverGA = population[i];
        }
    
        fitness[i] = 1 / (pow(d, 8) + 1);
    }
}
  
function normalizeFitness(){
    var sum = 0;
    for (var i = 0; i < fitness.length; i++){
        sum += fitness[i];
    }
    for (var i = 0; i < fitness.length; i++){
        fitness[i] = fitness[i] / sum;
    }
}

// Next generation
function nextGeneration(){
    var newPopulation = [];
    for (var i = 0; i < population.length; i++){
        var orderA = pickOne(population, fitness);
        var orderB = pickOne(population, fitness);
        var order = crossOver(orderA, orderB);
        mutate(order, mutationRate);
        newPopulation[i] = order;
    }
    population = newPopulation;
}
  
function pickOne(list, prob){
    var index = 0;
    var r = random(1);
  
    while (r > 0) {
        r = r - prob[index];
        index++;
    }
    index--;
    return list[index].slice();
}
  
function crossOver(orderA, orderB){
    var start = floor(random(1, orderA.length));
    var end = floor(random(start + 1, orderA.length));
    var neworder = []
    neworder[0] = 0;
    neworder.concat(orderA.slice(start, end));
    for (var i = 0; i < orderB.length; i++){
        var vertex = orderB[i];
        if (!neworder.includes(vertex)){
            neworder.push(vertex);
        }
    }
    return neworder;
}
  
function mutate(order, mutationRate) {
    for (var i = 0; i < totalVertices; i++){
        if (random(1) < mutationRate){
            var indexA = floor(random(1, order.length - 1));
            var indexB = (indexA + 1);
            swap(order, indexA, indexB);
        }
    }
}
