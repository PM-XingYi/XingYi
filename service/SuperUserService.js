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
SuperUserService.examineProject = function (projectID, approve,callback) {
	go.database.Project.findByIdAndUpdate(projectID, 
		{
			$set:
			{approved: approve}
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
SuperUserService.examineComment = function (commentID, approve,callback) {
	go.database.Comment.findByIdAndUpdate(commentID, 
		{
			$set:
			{approved: approve}
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
 */
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
}
