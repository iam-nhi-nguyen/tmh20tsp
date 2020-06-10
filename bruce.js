// Nhi Nguyen
// Traveling Salesman Problem

// Bruce force

// Set up
function setupBruce(){
    order = [];

    for (var i = 0; i < totalVertices; i++) {
        order[i] = i;
    }

    count = 0;

    var d = calcDistance(vertices, order);
    recordDistance = d;
    bestEver = order.slice();
  
    totalPermutations = factorial[totalVertices-1];
}

// Draw functions
function drawBruce(vertical){
    drawTitle("Vét cạn");

	drawRoute(pathColorResult, pathWeightResult, bestEver)

    drawVertices(startColorResult, verticesColorResult, radiusResult);
    
    if(vertical){
        translate(0, panelHeight);
    }
    else{
        translate(panelWidth, 0);
    }

    drawRoute(processColor, pathWeightProcess, order)

    drawVertices(processColor, processColor, radiusProcess);
    
    
	var percent = 100 * ((count + 1) / totalPermutations);
	if (percent < 0.01){
		percent = 0;
	}
	textSize(bodySize);
	fill(bodyColor);
	text('Độ dài: ' + nf(recordDistance, 0, 2) + ' px', 0, -2*bodySize);
    text(nf(percent, 0, 2) + '% hoàn thành / ' + nf(totalPermutations*(totalVertices - 1)) + ' phép tính', 0, -bodySize);
    
    var d = calcDistance(vertices, order);
	if (d < recordDistance) {
		recordDistance = d;
		bestEver = order.slice();
	}

    nextOrder();
    
    if(vertical){
        translate(panelWidth, - panelHeight);
    }
    else{
        translate(- panelWidth, panelHeight);
    }
}

// Lexical order
function nextOrder(){
    // STEP 1 of the algorithm
    var largestI = -1;
    for (var i = 1; i < order.length - 1; i++){
        if (order[i] < order[i + 1]){
            largestI = i;
        }
    }
    if (largestI != -1){
        count++;
  
        // STEP 2
        var largestJ = -1;
        for (var j = 1; j < order.length; j++){
            if (order[largestI] < order[j]){
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