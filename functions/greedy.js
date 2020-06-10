// Nhi Nguyen
// Traveling Salesman Problem

// Greedy

// Set up
function setupGreedy(){
    countGR = 0;
    totalCountGR = (totalVertices-1)*(totalVertices)/2;

    path = [];
    path[0] = 0;

    remainVertices = [];
    currentVertex = 0;
    for(var i = 1; i < totalVertices; i++){
        remainVertices[i-1] = i;
    }
}

// Draw functions
function drawGreedy(vertical){
	drawTitle("Tham lam");

	drawRoute(pathColorResult, pathWeightResult, path);

	drawVertices(startColorResult, verticesColorResult, radiusResult);

	if(remainVertices != null){
		nearestNeighbor();

		path[path.length] = remainVertices[0];

		stroke(processColor);
		strokeWeight(pathWeightProcess);
		noFill();
		beginShape();
		for (var i = 0; i < remainVertices.length; i++){
			var c = currentVertex;
			vertex(vertices[c].x, vertices[c].y);
			var n = remainVertices[i];
			vertex(vertices[n].x, vertices[n].y);
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

	if(vertical){
        translate(0, panelHeight);
    }
    else{
        translate(panelWidth, 0);
    }

    var dpath = calcDistancePath(path);
    var percentGR = 100 * (countGR / totalCountGR)

	textSize(bodySize);
    fill(bodyColor);
	text(nf(percentGR, 0, 2) + '% hoàn thành / ' + nf(totalCountGR, 0, 0) + ' phép tính', 0, -bodySize);
	if (remainVertices == null){
        if(mod == "all"){
            var percentOptimal = 100 * (recordDistance / dpath);
            text('Độ dài: ' + nf(dpath, 0, 2) + ' px; ' + nf(percentOptimal, 0, 2) + '% tối ưu', 0, -2*bodySize);
        }
        else{
            text('Độ dài: ' + nf(dpath, 0, 2) + ' px', 0, -2*bodySize);
        }
    }

    if(vertical){
        translate(panelWidth, - panelHeight);
    }
    else{
        translate(- panelWidth, panelHeight);
    }
}

// Nearest neighbor
function nearestNeighbor(){
    if (remainVertices != null){
        var bestNeighbor = 0;
        var c = currentVertex;
        var n = remainVertices[0];
        var bestDistance = dist(vertices[c].x, vertices[c].y, vertices[n].x, vertices[n].y);
        countGR ++;
  
        var d;
        for (var i = 1; i < remainVertices.length; i++){
            countGR ++;
            n = remainVertices[i];
            var d = dist(vertices[c].x, vertices[c].y, vertices[n].x, vertices[n].y);
            if (d < bestDistance){
                bestNeighbor = i;
                bestDistance = d;
            }
        }
        swap(remainVertices, 0, bestNeighbor);
    }
}
