var go = require('../globalObjects');
var ProjectService = function () {

}

/*
 * return all available projects
 * @return {Array of Project}
 */
ProjectService.allPassedProject = function () {
	go.database.Project.find({approved: "pass"},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		callback({
			success: true,
			message: docs
		});
	});
}

ProjectService.allFailedProject = function () {
	go.database.Project.find({approved: "fail"},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		callback({
			success: true,
			message: docs
		});
	});
}

ProjectService.allUncheckedProject = function () {
	go.database.Project.find({approved: "uncheck"},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		callback({
			success: true,
			message: docs
		});
	});
}

ProjectService.searchProject = function (keyword) {
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
			callback({
				success: true,
				message: docs
			});
	});
}

/*
 * return latest n projects
 * @param {Number} n
 * @return {Array of Project}
 * exist problems!!!!!!!!!!!!!
 */
ProjectService.latestProject = function (n) {
	go.database.Project.find({},
		{$sort: 
			{_id: -1}
		},function(err, projects){
			if(err){
				callback({
					success: false,
					message: "internal error"
				});
			}
			callback({
				success: true,
				message: projects
			});			
	});
	
}