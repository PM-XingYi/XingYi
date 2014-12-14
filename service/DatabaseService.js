var mongoose = require('mongoose');

var db = null;

var DatabaseService = function (dbUrl) {
	this.dbUrl = dbUrl;
	this.User = require('../database/User');
	this.Individual = require('../database/Individual');
	this.Organization = require('../database/Organization');
	this.SuperUser = require('../database/SuperUser');
	this.Project = require('../database/Project');
	this.Comment = require('../database/Comment');
	this.Donation = require('../database/Donation');
}
	mongoose.connect('mongodb://localhost/test');

var DatabaseConnector = function (dbUrl) {
	if (db === null) {
		db = new DatabaseService(dbUrl);
	}
	return db;
}

DatabaseService.prototype.connect = function(succ, fail) {
	mongoose.connect(this.dbUrl, function(e) {
		if (e){
			fail(e.message);
		} else {
			var msg = "connect success!";
			succ(msg);
		}
	});
};

module.exports = DatabaseConnector;