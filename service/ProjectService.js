var go = require('../globalObjects');
var ProjectService = function () {

}

/*
 * return all available projects
 * @return {Array of Project}
 */
ProjectService.allPassedProject = function (callback) {
	go.database.Project.find({approved: "pass"},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		var answer = [];
		if(docs.length > 0){
			answer = docs;
		}
		callback({
			success: true,
			message: answer
		});
	});
}

ProjectService.allFailedProject = function (callback) {
	go.database.Project.find({approved: "fail"},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		var answer = [];
		if(docs.length > 0){
			answer = docs;
		}
		callback({
			success: true,
			message: answer
		});
	});
}

ProjectService.allUncheckedProject = function (callback) {
	go.database.Project.find({approved: "uncheck"},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		var answer = [];
		if(docs.length > 0){
			answer = docs;
		}
		callback({
			success: true,
			message: answer
		});
	});
}

ProjectService.searchProject = function (keyword, callback) {
	var regexStr = '/'+keyword+'/';
	go.database.Project.find(
		{
			$or:
			[
				{name: {$regex: regexStr}},
				{desc: {$regex: regexStr}}
			]			
		},function(err, docs){
			if(err){
				callback({
					success: false,
					message: "internal error"
				});
			}
			console.log(docs);
			var answer = [];
			if(docs.length > 0){
				answer = docs;
			}
			callback({
				success: true,
				message: answer
			});
	});
}

/*
 * return latest n projects
 * @param {Number} n
 * @return {Array of Project}
 * exist problems!!!!!!!!!!!!!
 */
ProjectService.latestProject = function (n, callback) {
	go.database.Project.find({},
		{$sort: 
			{name: -1}
		},function(err, projects){
			if(err){
				callback({
					success: false,
					message: "internal error"
				});
			}
			var answer = [];
			if(projects.length > 0){
				answer = projects;
			}
			callback({
				success: true,
				message: answer
			});			
	});
	
}
module.exports = ProjectService;