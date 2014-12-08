var config = require('./config.json'),
	database = require('./service/DatabaseService')(config.dbUrl);

var ns = {};

ns.database = database;

module.exports = ns;
