var go = require('../globalObjects');
var ProjectService = function () {

}

/*
 * return all available projects
 * @return {Array of Project}
 */
ProjectService.getAllProjectByStatus = function (status,callback) {
	go.database.Project.find(/*{approved: status}*/{},function(err, docs){
		console.log("there");
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		console.log(docs);
		var answer = [];
		if(docs  === null || docs  === undefined){
			callback({
				success: false,
				message: "cannot find"
			});
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

ProjectService.searchProject = function (keyword, callback) {
	var regexStr = '/'+keyword+'/';
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
	go.database.Project.find({}).sort({_id: -1}).limit(n).exec(function(err, projects){
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
 * @return {an Array of info [0] = project [1] = user}
 */
ProjectService.getProjectById = function(projectID, callback){
	go.database.Project.findById(projectID).populate('owner joinedIndividual comment donation').exec(function(err, project){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		go.database.User.find({detail: project.owner._id}).populate('detail').exec(function(err, user){
			if(err){
				console.log(err);
				callback({
					success: false,
					message: "internal error"
				});
			}
			var answer = [];
			if(project  === null || project  === undefined){
				answer = "cannot find it";
			}else{
				answer.push(project);
			}
			answer.push(user);
			console.log(answer);
			callback({
				success: true,
				message: answer
			});
		});	
	});
}

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
			var answer;
			if(project  === null || project  === undefined){
				answer = "cannot find it";
			}else{
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