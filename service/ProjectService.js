var go = require('../globalObjects');
var ProjectService = function () {

}

/*
 * return all available projects
 * @return {Array of Project}
 */
ProjectService.prototype.allPassedProject = function () {
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

ProjectService.prototype.allFailedProject = function () {

}

ProjectService.prototype.allUncheckedProject = function () {

}

ProjectService.prototype.searchProject = function (keyword) {

}

/*
 * return latest n projects
 * @param {Number} n
 * @return {Array of Project}
 */
ProjectService.prototype.latestProject = function (n) {
	go.database.Project.find().sort({"_id": -1}).pretty().toArray(function(err,projects){
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