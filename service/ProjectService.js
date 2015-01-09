var go = require('../globalObjects');
var ProjectService = function () {

}

/*
 * return all available projects
 * @return {Array of Project}
 */
ProjectService.getAllProjectByStatus = function (status,callback) {
	go.database.Project.find({approved: status},function(err, docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		var answer = [];
		if(docs  !== null && docs  !== undefined){
			answer = docs;
		}
		callback({
			success: true,
			message: answer
		});
	});
}

ProjectService.searchProject = function (keyword, callback) {
	var regexStr = keyword;
	go.database.Project.find(
		{
			$or:
			[
				{name: {$regex: regexStr}},
				{desc: {$regex: regexStr}},
				{longDesc: {$regex: regexStr}}
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

/*
 * return latest n projects
 * @param {Number} n
 * @return {Array of Project}
 */
ProjectService.latestProject = function (n, callback) {
	go.database.Project.find({approved: 1}).sort({_id: -1}).limit(n).exec(function(err, projects){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		var answer = [];
		if(projects  === null || projects  === undefined){
			callback({
				success: false,
				message: "find project error"
			});	
		}else{
			answer = projects;
		}
		callback({
			success: true,
			message: answer
		});			
	});	
}

/*
 * return all info of a project
 * @param {String} projectID
 * @return {project}
 */
ProjectService.getProjectById = function(projectID, callback){
	go.database.Project.findById(projectID).populate('owner joinedIndividual comment donation').exec(function(err, project){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		if(project  === null || project  === undefined){
			callback({
				success: false,
				message: "cannot find it"
			});
		}else{
			var answer = project;
			go.database.User.find({detail: project.owner._id}).populate('detail').exec(function(err, user){
				if(err){
					console.log(err);
					callback({
						success: false,
						message: "internal error"
					});
				}
				answer.detail = user[0];

				// format date
				for (var i = 0; i < answer.expenditure.length; ++i) {
					var temp = answer.expenditure[i].date.toISOString();
					temp = temp.substr(0, 10);
					answer.expenditure[i].dateStr = temp;
				}
				for (var i = 0; i < answer.mileStone.length; ++i) {
					var temp = answer.mileStone[i].date.toISOString();
					temp = temp.substr(0, 10);
					answer.mileStone[i].dateStr = temp;
				}
			});	
			go.database.Comment.find({project: projectID}).populate('user').sort({date: -1}).exec(function(err, comments){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}
				if(comments === null || comments === undefined){
					console.log(comments);
				}else{
					var commentList = [];
					var ids = [];
					for(var i = 0;i<comments.length;i++){
						console.log(comments[i].user._id);
						ids.push(comments[i].user._id.toString());
					}
					go.database.User.find({detail:{$in: ids}}, function(err,users){
						if(err){
							console.log(err);
							callback({
								success: false,
								message: "internal error"
							});
						}
						if(users === null || users === undefined){
							console.log(users);
							callback({
								success: false,
								message: answer
							});
						}else{
							for(var i = 0;i<users.length;i++){
								var temp;
								for(var k = 0;k<ids.length;k++){
									if(ids[k] == users[i].detail){
										users[i].detail = comments[k].user;
										comments[k].user = users[i];
										temp = comments[k];
										console.log(temp);
										commentList.push(temp);
										break;
									}
								}
							}
							console.log(commentList);
							answer.comment = commentList;

							//format date
							for (var i = 0; i < answer.comment.length; ++i) {
								var temp = answer.comment[i].date.toISOString();
								temp = temp.substr(0, 10);
								answer.comment[i].dateStr = temp;
							}
							
							callback({
								success: true,
								message: answer
							});
						}
					});
				}	
			});
		}		
	});
}

/*
 * @param {String} username 
 * return array of project 
 * @return {array of project}
 */
ProjectService.getOrganizationProject = function(username, callback){
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		go.database.Project.find({owner:user.detail}, function(err, project){
			if(err){
				callback({
					success: false,
					message: "internal error"
				});
			}
			var answer = [];
			if(project !== null && project !== undefined){
				answer = project;
			}
			callback({
				success: true,
				message: answer
			});
		});
	});
	
}

module.exports = ProjectService;
