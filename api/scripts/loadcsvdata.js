var fs = require('fs');
var csv = require('csv-parser');
var db_helper = require('./database_helper');

db_helper.truncateTable('shipments_data');

fs.createReadStream('../assets/ShipmentData.csv')
.pipe(csv())
.on('data', function(data){
	try {
		db_helper.insertData('shipments_data', data);
	}
	catch(err) {
		console.log(err);
	}
})
.on('end',function(){
	console.log('Insertion Completed');
});