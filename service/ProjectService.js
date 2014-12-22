var go = require('../globalObjects');
var ProjectService = function () {

}

/*
 * return all available projects
 * @return {Array of Project}
 */
ProjectService.prototype.allProject = function () {
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