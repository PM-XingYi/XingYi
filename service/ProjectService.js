var go = require('../globalObjects');
var ProjectService = function () {

}

/*
 * return all available projects
 * @return {Array of Project}
 */
ProjectService.prototype.allProject = function () {
	go.database.Project.find()
}

/*
 * return latest n projects
 * @param {Number} n
 * @return {Array of Project}
 */
ProjectService.prototype.latestProject = function (n) {

}