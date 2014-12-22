var go = require('../globalObjects');
var SuperUserService = function () {

}

/*
 * examine project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {Boolean} approve
 * @return {Boolean} success
 */
SuperUserService.prototype.examineProject = function (projectID, approve) {
	go.database.Project.findByIdAndUpdate(projectID, {$set: {approved: approve}},  
		callback({
			success: true,
			message: "change the aprroved state successfully"
		}));
}

/*
 * examine comment
 * @param {String} username
 * @param {ObjectId} comment id
 * @param {Boolean} approve
 * @return {Boolean} success
 */
SuperUserService.prototype.examineComment = function (commentID, approve) {
	go.database.Comment.findByIdAndUpdate(commentID, {$set: {approved: approve}},  
		callback({
			success: true,
			message: "change the aprroved state successfully"
		}));
}
