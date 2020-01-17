
console.log(Table_1.getDataSource().getDataExplorer());

var resultSet = Table_1.getDataSource().getResultSet();
console.log(resultSet);
var City = "";
var rawvalue = "";
var final = "";

for(var i=0; i<resultSet.length; i++) {
	rawvalue = resultSet[i]['@MeasureDimension'].rawValue;
	City =  resultSet[i]['City'].id;

	var x = i % 2;
	if(x === 1) {
		final = final + rawvalue + ",";
		final = final + "\"" + City + "\"],";
	} else {
		final = final +  "[" + rawvalue + ",";
	}
	console.log("City: " + City + ",val:" + rawvalue);
}

final = final.substr(0, final.length-1);
console.log(final);

Map_1.setValue('Map_1:["Lat","Long","Name"],' + final);
