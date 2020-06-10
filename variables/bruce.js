// Nhi Nguyen
// Traveling Salesman Problem

// Bruce force
var order;

var totalPermutations;
var count = 0;

var recordDistance;
var bestEver;

var factorial = [1];
for (var i = 1; i < 21; i++){
	factorial[i] = factorial[i-1]*i;
}
