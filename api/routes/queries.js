var promise = require('bluebird');

var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/shipping';
var db = pgp(connectionString);

var findMatch = function findMatch(jsonObject, value) {
	var hasMatch =false;
	for (var index = 0; index < jsonObject.length; ++index) {
		var source = jsonObject[index];
		if(source.name == value){
			console.log('matched')
			return hasMatch = index;
			break;
		}
	}
	return hasMatch;
}

function getAllShippingData(req, res, next) {

	db.any('select * from shipments_data order by  new_shipment_id;')
	.then(function(result){
		if (result && result.length > 0){
			var sourceObject = {};
			sourceObject.children = []
			for (var key in result) {
				if (result.hasOwnProperty(key)) {
					var val = result[key];
					sourceObject.name = result[key].source_id
					var exists = findMatch(sourceObject.children, result[key].new_shipment_id)

					if( exists != false) {
						var children = {name: result[key].shipment_id, size: result[key].weight, tooltip: result[key].cost}
						sourceObject.children[exists].children.push(children);
			    	// sourceObject.children.children.push(children)
			    } else {
			    	var children = {
			    		name: result[key].new_shipment_id,
			    		size: result[key].new_weight,
			    		tooltip: result[key].new_cost,
			    		children: [
			    		{name: result[key].shipment_id, size: result[key].weight, tooltip: result[key].cost}
			    		]
			    	};
			    	sourceObject.children.push(children)
			    }

			}
		}
		console.log(sourceObject)
		return sourceObject;
	}else {
			//throw error;
		}
	})
.then(function(data) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.status(200)
	.json({
		status: 'success',
		data: data,
		message: 'Retrieved All Shipping data'
	});
})
.catch(function(err) {
	return next(err);
});
}

function getAllShippingsData(req, res, next) {
	db.any('select * from shipments_data')
	.then(function(result){
		console.log(result)
		if (result && result.length > 0){
			var sourceObject = {};
			result.forEach(function (row) {
				sourceObject[row.source_id] = {
					name: row.source_id,
					children: []
				};
				var parent = getParent(result, 'source_id', row.source_id);
				parent.forEach(function (p) {
					var child = {
						name: p.new_shipment_id,
						size: p.new_weight,
						children: []
					};
					getChildren(result, 'new_shipment_id', p.new_shipment_id).forEach(function (c) {
						child.children.push({
							name: c.id,
							size: c.weight
						})
					});
					sourceObject[row.source_id].children.push(child);
				});
			});

			var getChildren = function (rows, column, value) {
				return rows.filter(function (row) {
					return row[column] === value;
				});
			};
			console.log(sourceObject)
			console.log('test')
		}else {
				//throw error;
				console.log('error')
			}
		})
	.then(function(data) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.status(200)
		.json({
			status: 'success',
			data: data,
			message: 'Retrieved All Shipping data'
		});
	})
	.catch(function(err) {
		return next(err);
	});
}

module.exports = {
	getAllShippingData: getAllShippingData
};