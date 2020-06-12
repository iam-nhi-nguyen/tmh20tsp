// Nhi Nguyen
// Traveling Salesman Problem
// Based from code of Daniel Shiffman for this video https://youtu.be/9Xy-LMAfglE

// Set up //
function setup() {
	createCanvas(window_Width, window_Height);

	framerate = 10;
	
	if(rand){
		if(mod == "all"){
			panelWidth = window_Width / 3;
			panelHeight = window_Height / 2;
		}
		else{
			panelWidth = window_Width / 2;
			panelHeight = window_Height;
		}
	}
	else{
		if(mod == "all"){
			panelWidth = window_Width / 4;
			panelHeight = window_Height / 2;
		}
		else{
			panelWidth = window_Width / 2;
			panelHeight = window_Height / 2;
		}
	}
	
	findVertices();

	if(totalVertices == distances.length){
		if(mod == "all"){
			setupBruce();
			setupGreedy();
			setupGenetic();
		}
		else if(mod == "bruce"){
			setupBruce();
		}
		else if(mod == "greedy"){
			setupGreedy();
			framerate = 2;
		}
		else{
			setupGenetic();
		}
		
		draw();
	}
}

// Draw //
function draw() {
	background(backgroundColor);
	frameRate(framerate);

	translate(padding, padding);

	var isnumed = false;

	if(!rand){
		isnumed = true;

		if(mod == "all"){
			translate(0, panelHeight / 2);
			drawMap();
			translate(panelWidth, - panelHeight / 2);
		}
		else{
			translate(panelWidth / 2, 0);
			drawMap();
			translate(- panelWidth / 2, panelHeight);
		}
	}

	if(mod == "all"){
		drawBruce(vertical = true, numbered = isnumed);
		drawGreedy(vertical = true, numbered = isnumed);
		drawGenetic(vertical = true, numbered = isnumed);
	}
	else{
		if(mod == "bruce"){
			drawBruce(vertical = false, numbered = isnumed);
		}
		else if(mod == "greedy"){
			drawGreedy(vertical = false, numbered = isnumed);
		}
		else{
			drawGenetic(vertical = false, numbered = isnumed);
		}
	}
}
