// Nhi Nguyen
// Traveling Salesman Problem

function findVertices(){
    totalVertices = parseInt(document.getElementById('numVer').value);

    if(rand){
        randomVertices();
        randomDistances();
    }
    else{
        fixedVertices();
        //randomDistances();
        if(document.getElementById('distMat').value == ""){
            distances = distancesSample;
        }
        else{
            fixedDistances();
        }
    }
}

function randomVertices(){
    vertices = [];

    // Get random vertices
    for (var i = 0; i < totalVertices; i++) {
        var v = createVector(random(panelWidth - 2*padding), random(panelHeight - 2*padding));
        vertices[i] = v;
    }
}

function randomDistances(){
    distances = [];

    for(var i = 0; i < totalVertices; i++){
        distances_i = [];
        for(var j = 0; j < totalVertices; j++){
            var d = dist(vertices[i].x, vertices[i].y, vertices[j].x, vertices[j].y);
            distances_i.push(d);
        }
        distances.push(distances_i);
    }
}

function fixedVertices(){
    vertices = [];

    for (var i = 0; i < totalVertices; i++) {
        var v = createVector(verticesSample[i][0]*35, verticesSample[i][1]*35);
        vertices[i] = v;
    }
}

function fixedDistances(){
    tmp = document.getElementById('distMat').value;
    tmp = tmp.split("\n");
    for(var i = 0; i < tmp.length; i++){
        tmp[i] = tmp[i].split(" ").map(numStr => parseInt(numStr));
    }
    distances = tmp;
}
