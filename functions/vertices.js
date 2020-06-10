// Nhi Nguyen
// Traveling Salesman Problem

function findVertices(){
    if(random){
		randomVertices();
	}
}

function randomVertices(){
    vertices = [];
    totalVertices = document.getElementById('numVer').value;

    // Get random vertices
    for (var i = 0; i < totalVertices; i++) {
        var v = createVector(random(panelWidth - 2*padding), random(panelHeight - 2*padding));
        vertices[i] = v;
    }
}
