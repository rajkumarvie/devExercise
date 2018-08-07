
var promise = require('bluebird');


var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/shipping';
var db = pgp(connectionString);

function truncateTable(tableName) {
	db.none('TRUNCATE TABLE shipments_data')
		.then(function() {
			console.log('table truncated');
		});
}

function insertData(tableName, data) {
  data.shipment_id = parseInt(data.shipment_id);
  console.log(data.shipment_id);
  data.weight = parseInt(data.weight);
  data.cost = parseInt(data.cost);
  data.new_weight = parseInt(data.new_weight);
  data.new_cost = parseInt(data.new_cost);
  data.total_tls = parseInt(data.total_tls);
  console.log(data)
	db.none('insert into shipments_data(shipment_id,source_id,destination_id,date,weight,cost,new_shipment_id,new_weight,new_cost,total_tls)' +
      'values(${shipment_id},${source_id},${destination_id},${date},${weight},${cost},${new_shipment_id},${new_weight},${new_cost},${total_tls})', data)
      .then(function () {
      	console.log('success')
      return {
          status: 'success',
          message: 'Inserted one set'
        };
    })
    .catch(function (err) {
      console.log(err);
    });
}


module.exports = {
	createTable: createTable,
	truncateTable: truncateTable,
	insertData: insertData
}

