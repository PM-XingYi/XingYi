var go = require('../globalObjects');
var ProjectService = function () {

}

/*
 * return all available projects
 * @return {Array of Project}
 */
ProjectService.allPassedProject = function () {
	go.database.Project.find().toArray(function(err,projects){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			callback({
				success: true,
				message: projects
			});
		}
	});
}

ProjectService.allFailedProject = function () {

}

ProjectService.allUncheckedProject = function () {

}

ProjectService.searchProject = function (keyword) {

}

/*
 * return latest n projects
 * @param {Number} n
 * @return {Array of Project}
 */
ProjectService.latestProject = function (n) {
	go.database.Project.find().sort({"_id": -1}).all(function(projects){
		callback({
			success: true,
			message: projects
		});

	});
}