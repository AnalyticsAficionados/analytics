var resultSet = Table_2.getDataSource().getResultSet();
console.log(resultSet);

var X = "";
var Y = "";
var Z = "";
var value = "";

for(var i=0; i<resultSet.length; i++) {
	X = resultSet[i]['X'].description;
	Y =  resultSet[i]['Y'].description;
	Z = resultSet[i]['Z'].description;
	
	console.log(X + ":" + Y + ":" + Z);

	value = value + X + "," + Y + "," + Z + ";";	
}

value = value.substr(0, value.length-1);
console.log(value);

Scatter_2.setText('Scatter_2|' + value);
