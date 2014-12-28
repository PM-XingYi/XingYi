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
<<<<<<< HEAD
SuperUserService.examineComment = function (commentID, approve, remark, callback) {
=======
SuperUserService.examineComment = function (commentID, approve,callback) {
>>>>>>> develop_fix_backend
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
<<<<<<< HEAD
SuperUserService.getAllComment = function (callback) {
	// go.database.Comment.find({},function(err, docs){
	// 	if(err){
	// 		callback({
	// 			success: false,
	// 			message: "internal error"
	// 		});
	// 	}
	// 	console.log(docs);
	// 	callback({
	// 		success: true,
	// 		message: docs
	// 	});
	// });
=======
SuperUserService.getAllCommentByStatus = function (approve, callback) {
	go.database.Comment.find({approved: approve},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		var answer = [];
		if(docs  === null || docs  === undefined){
			answer = "cannot find it";
		}else{
			answer = docs;
		}
		console.log(answer);
		callback({
			success: true,
			message: answer
		});
	});
>>>>>>> develop_fix_backend
}
