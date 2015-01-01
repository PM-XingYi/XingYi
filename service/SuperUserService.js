var go = require('../globalObjects');
var SuperUserService = function () {

}

/*
 * examine project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {Number} approve
 * @param {String} remark
 * @return {Boolean} success
 */
SuperUserService.examineProject = function (projectID, approve, remark, callback) {
	go.database.Project.findByIdAndUpdate(projectID, 
		{
			$set: {
				approved: approve,
				remark: remark
			}
		}, function(err, result){
			if(err){
				callback({
					success: false,
					message:"internal error"
				});
			}
			callback({
				success: true,
				message: "change the aprroved state successfully"
			});
	});
}

/*
 * examine comment
 * @param {String} username
 * @param {ObjectId} comment id
 * @param {Boolean} approve
 * @return {Boolean} success
 */
SuperUserService.examineComment = function (commentID, approve, remark, callback) {
	go.database.Comment.findByIdAndUpdate(commentID, 
		{
			$set: {
				approved: approve,
				remark: remark
			}
		}, function(err, result){
			if(err){
				callback({
					success: false,
					message:"internal error"
				});
			}
			callback({
				success: true,
				message: "change the aprroved state successfully"
			});
	});
}

/*
 * get unchecked, passed, failed comments
 * @return {
 *	 @param {Array of Comment} unchecked
 *	 @param {Array of Comment} passed
 *	 @param {Array of Comment} failed
 * }
 */

SuperUserService.getAllCommentByStatus = function (approve, callback) {
	go.database.Comment.find(/*{approved: approve}*/{},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		var answer = [];
		if(docs !== null && docs  !== undefined){
			answer = docs;
		}
		callback({
			success: true,
			message: answer
		});
	});
}

module.exports = SuperUserService;
