var databaseConnector = require('../service/DatabaseService');
var databaseService = databaseConnector();
databaseService.connect(function(msg,db) {
	console.log(msg);
//	db.dropDatabase();
},
function(e) {
				console.log(e);
			}


);
	var mock = require('../test/Mock');
	mock.insertSuperUser();
	mock.insertUser();
	mock.insertOrg();
//	mock.insertPj();
