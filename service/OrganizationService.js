var go = require('../globalObjects'),
	MD5 = require('MD5');
var OrganizationService = function () {

}

/*
 * register an individual user
 * @param {String} username (unique)
 * @param {String} MD5 of password
 * @param {String} email
 * @param {String} phone
 * @param {String} organization name
 * @param {String} organization number
 * @return {Boolean} success
 */
OrganizationService.register = function (username, password, email, phone, orgName, orgNumber, callback) {
	//check if user exists
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			console.log(err);
		}
		if(user !== null){
			callback({
				success:false,
				message: "user already exists"
			});
		} else{
			var organization = new go.database.Organization({
				phone: phone,
				instituteName: orgName,
				instituteNumber: orgNumber
			});
			organization.save(function(err, organization){
				if(err){
					console.log(err);
				}
				var user = new go.database.User({
					username: username,
					password: MD5(password),
					email: email,
					userType: "organization",
					detail: organization._id
				});
				user.save(function (err) {
					if (err) {
						console.log(err);
					}
					else {
						callback({
							success: true
						});
					}
				});
			});
		}
	});
}
/*
 * return user info by username
 * @param {String} username
 * @return {Individual} user
 */
OrganizationService.getUser = function (username, callback) {
	go.database.User.findOne({username: username}, function (err, user) {
		if (err) {
			callback({
				success: false,
				message: "internal error"
			});
		} else {
			var answer = JSON.parse(JSON.stringify(user));
			go.database.Organization.findById(user.detail, function (err, organization) {
				if (err) {
					callback({
						success: false,
						message: "internal error"
					});
				} else {
					answer.detail = organization;
					console.log(answer);
					callback({
						success: true,
						message: answer
					});
				}
			});
		}
	});
}


/*
 * publish a project
 * @param {String} username
 * @param {
 *   @param {String} name
 *   @param {String} desc
 *   @param {Number} moneyNeeded
 * } project info
 * @return {Boolean} success
 */
OrganizationService.publishProject = function (username, projectInfo, callback) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			var project = new go.database.Project({
				name:projectInfo.name, 
				desc:projectInfo.desc, 
				moneyNeeded: projectInfo.moneyNeeded,
				owner: user.detail
			});
			project.save(function(err, project){
				if(err){
					callback({
						success: false,
						message:"internal error"
					});
				}
				go.database.Organization.findByIdAndUpdate(
				{
					_id:user.detail
				},{
					$addToSet: 
					{
						project: project._id
					}
				},function(err, result){
					if(err){
						callback({
							success: false,
							message:"internal error"
						});
					}else{
						callback({
							success: true,
							message: "publish successfully"
						});
					}
				});										
			});
		}
	});
}

/*
 * update user info
 * @param {Project} newProjectInfo
 * @return {Boolean} success
 */
OrganizationService.updateProject = function (newProjectInfo, callback) {
}

/*
 * add milestone for a project
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {String} title
 *   @param {String} desc
 * } milestone
 * @return {Boolean} success
 */
OrganizationService.addMilestone = function (projectID, milestone, callback) {
	// organization user can only add milestones from it's own page, 
	//so don't check the owner of the projectID is this organization
	go.database.Project.findByIdAndUpdate(
		{
			_id:projectID
		},{
			$addToSet: 
			{
				mileStone:{
					date: milestone.date,
					title: milestone.title,
					desc: milestone.desc
				}
			}
		},
		function(err, result){
			if(err){
				callback({
					success: false,
					message:"internal error"
				});
			}else{
				callback({
					success: true,
					message: "add milestone successfully"
				});
			}
	});			
}

/*
 * add expenditure for a project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {Number} expense
 *   @param {String} usage
 * } expenditure
 * @return {Boolean} success
 */
OrganizationService.addExpenditure = function (username, projectID, expenditure, callback) {
	go.database.Project.findByIdAndUpdate(
		{
			_id:projectID
		},{
			$addToSet: 
			{
				expenditure:{
					date: expenditure.date,
					expense: expenditure.expense,
					usage: expenditure.usage
				}
			}
		},
		function(err, result){
			if(err){
				callback({
					success: false,
					message:"internal error"
				});
			}else{
				callback({
					success: true,
					message: "add expenditure successfully"
				});
			}
	});				
}

/*
 * examine applied individual
 * @param {String} username
 * @param {Boolean} approved  approved type is Number!!not boolean!!
 * @return {Boolean} success
 */
OrganizationService.examineApplication = function (applicationID, approved, callback) {
	go.database.Application.findByIdAndUpdate(applicationID,{
		$set:
		{status: approved}
	},function(err,docs){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		callback({
			success: true,
			message: "true"
		});
	});	
}


/*I cannot put userinfo with application info
 * so they are kept in two array, 
 * eg. application[a](stored in answer[a])'s corresponding user info is stored in answer[2a+1]
 *
 */
OrganizationService.getUncheckedApplicationForProject = function(projectID, callback){
	go.database.Application.find({project: projectID, status:2}).populate('user').exec(function(err, applications){
		if(err){
			console.log(err);
			callback({
				success: false,
				message: "internal error"
			});
		}
		var answer = [];
		if(applications === null || applications === undefined){
			console.log(applications);
		}else{
			answer = applications;
			var ids = [];
			for(var i = 0;i<applications.length;i++){
				console.log(applications[i].user._id);
				ids.push(applications[i].user._id);
			}
			go.database.User.find({detail: {$in: ids}}).populate('detail').exec(function(err, users){
				if(err){
					console.log(err);
					callback({
						success: false,
						message: "internal error"
					});
				}
				
				if(users === null || users === undefined){
					console.log(users);
				}else{
					answer.push(users);
				}
				console.log(answer);
				callback({
					success:true,
					message:answer
				});
			});
		}	
	});
}


OrganizationService.getVolunteerForProject = function(projectID, callback){
	go.database.Application.find({project: projectID, status:1}).populate('user').exec(function(err, applications){
		if(err){
			console.log(err);
			callback({
				success: false,
				message: "internal error"
			});
		}
		var answer = [];
		if(applications === null || applications === undefined){
			console.log(applications);
		}else{
			answer = applications;
			var ids = [];
			for(var i = 0;i<applications.length;i++){
				console.log(applications[i].user._id);
				ids.push(applications[i].user._id);
			}
			go.database.User.find({detail: {$in: ids}}).populate('detail').exec(function(err, users){
				if(err){
					console.log(err);
					callback({
						success: false,
						message: "internal error"
					});
				}				
				if(users === null || users === undefined){
					console.log(users);
				}else{
					answer.push(users);
				}
				console.log(answer);
				callback({
					success:true,
					message:answer
				});
			});
		}	
	});
}


module.exports = OrganizationService;
