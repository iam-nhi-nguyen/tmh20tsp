// Nhi Nguyen
// Traveling Salesman Problem

// Draw functions

function drawTitle(title){
    textSize(titleSize);
	fill(titleColor);
	text(title, - titleSize, - titleSize);
}

function drawVertices(fillColorStart, fillColor, radius, numbered = false){
    stroke(backgroundColor);
    strokeWeight(1);

    fill(fillColorStart);
    ellipse(vertices[0].x, vertices[0].y, radius, radius);

    fill(fillColor);
    for (var i = 1; i < totalVertices; i++){
        ellipse(vertices[i].x, vertices[i].y, radius, radius);
    }

    strokeWeight(0);

    if(numbered){
        numberVertices();
    }
}

function drawRoute(color, weight, route){
    stroke(color);
    strokeWeight(weight);
    noFill();

    beginShape();
    for (var i = 0; i < route.length; i++) {
        var n = route[i];
        vertex(vertices[n].x, vertices[n].y);
    }
    endShape();

    strokeWeight(0);
}

function numberVertices(){
    for(var i = 0; i < totalVertices; i++){
        textSize(bodySize);
	    fill(bodyColor);
        text(nf(i + 1), vertices[i].x - 5, vertices[i].y - 10);
    }
}

function drawMap(){
    for(var i = 0; i < totalVertices; i++){
        for(var j = i+1; j < totalVertices; j++){
            var verticeA = vertices[i];
            var verticeB = vertices[j];
           
            stroke(pathColorResult);
            strokeWeight(pathWeightResult);
            noFill();

            beginShape();
            vertex(verticeA.x, verticeA.y);
            vertex(verticeB.x, verticeB.y);
            endShape();

            strokeWeight(0);
        }
    }

    drawVertices(startColorResult, verticesColorResult, radiusResult, true);

    for(var i = 0; i < totalVertices; i++){
        for(var j = i+1; j < totalVertices; j++){
            var verticeA = vertices[i];
            var verticeB = vertices[j];
            
            
            var textX = (verticeA.x + verticeB.x)/2;
            var textY = (verticeA.y + verticeB.y)/2;
            var slope = (verticeA.y - verticeB.y)/(verticeA.x - verticeB.x);
            if(slope < 0){
                var degree = atan(-slope);
            }
            else{
                var degree = -atan(slope);
            }

            translate(textX, textY);
            rotate(-degree);
            
            textSize(bodySize);
	        fill(bodyColor);
            text(nf(distances[i][j], 0, 0), -5, 0);

            rotate(degree);
            translate(-textX, -textY);
        }
    }

    numberVertices();
}

// Helpers

// Swap functions
function swap(a, i, j){
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

// Custome shuffle
function customShuffle(array, first){
    const updatedArray = shuffle(array).filter(item => item !== first);
    return [first, ...updatedArray];
}

// Distance

// Order distance
function calcDistance(order){
    var sum = 0;
    for (var i = 0; i < order.length - 1; i++){
        var verticeAIndex = order[i];
        var verticeBIndex = order[i + 1];
        sum += distances[verticeAIndex][verticeBIndex];
    }
    return sum;
}
