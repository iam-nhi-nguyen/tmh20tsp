// Nhi Nguyen
// Traveling Salesman Problem

// Draw functions
function drawTitle(title){
    textSize(titleSize);
	fill(titleColor);
	text(title, - titleSize, - titleSize);
}

function drawVertices(fillColorStart, fillColor, radius){
    stroke(backgroundColor);
    strokeWeight(1);

    fill(fillColorStart);
    ellipse(vertices[0].x, vertices[0].y, radius, radius);

    fill(fillColor);
    for (var i = 1; i < totalVertices; i++){
        ellipse(vertices[i].x, vertices[i].y, radius, radius);
    }

    strokeWeight(0);
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
function calcDistance(points, order){
    var sum = 0;
    for (var i = 0; i < order.length - 1; i++){
        var verticeAIndex = order[i];
        var verticeA = points[verticeAIndex];
        var verticeBIndex = order[i + 1];
        var verticeB = points[verticeBIndex];
        var d = dist(verticeA.x, verticeA.y, verticeB.x, verticeB.y);
        sum += d;
    }
    return sum;
}

// Path distance
function calcDistancePath(path){
    var sum = 0;
    for (var i = 0; i < path.length - 1; i++){
        var d = dist(vertices[path[i]].x, vertices[path[i]].y, vertices[path[i+1]].x, vertices[path[i+1]].y);
        sum += d;
    }
    return sum;
}
