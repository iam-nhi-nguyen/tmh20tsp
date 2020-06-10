// Nhi Nguyen
// Traveling Salesman Problem
// Based from code of Daniel Shiffman for this video https://youtu.be/9Xy-LMAfglE

// Set up //
function setup() {
	createCanvas(window_Width, window_Height);

	framerate = 5;

	if(mod == "all"){
		panelWidth = window_Width / 3;
		panelHeight = window_Height / 2;

		findVertices();

		setupBruce();

		setupGreedy();

		setupGenetic();
	}
	else{
		panelWidth = window_Width / 2;
		panelHeight = window_Height;

		findVertices();

		if(mod == "bruce"){
			setupBruce();
		}
		else if(mod == "greedy"){
			setupGreedy();

			framerate = 2;
		}
		else{
			setupGenetic();
		}
	}

	console.log(framerate);

	draw();
}

// Draw //
function draw() {
	background(backgroundColor);
	frameRate(framerate);

	translate(padding, padding);

	if(mod == "all"){
		drawBruce(vertical = true);

		drawGreedy(vertical = true);

		drawGenetic(vertical = true);
	}
	else{
		if(mod == "bruce"){
			drawBruce(vertical = false);
		}
		else if(mod == "greedy"){
			drawGreedy(vertical = false);
		}
		else{
			drawGenetic(vertical = false);
		}
	}
}