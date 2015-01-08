var go = require('../globalObjects'),
	MD5 = require('MD5'),
	fs = require('fs'),
	path = require('path');
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
			organization.save(function(err){
				if(err){
					console.log(err);
					callback({
						success: false,
						message: "internal error"
					});
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
						callback({
							success: false,
							message: "internal error"
						});
					}
					else {
						// copy default img
						var readable = fs.createReadStream(path.join(__dirname, "../public/img/pj_default.jpg"));
						var writable = fs.createWriteStream(path.join(__dirname, "../public/img/pj_" + projectRes._id + ".jpg"));
						readable.pipe(writable);
						
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
 * update user info
 * @param {
 *   @param {String} key
 *   @param {String} value
 * } newUserInfo
 * @return {Boolean} success
 */
OrganizationService.updateUser = function (username, newUserInfo, callback) {
	go.database.User.findOne({username: username}, function (err, user) {
		if (user.userType !== 'organization') {
			callback({
				success: false,
				message: "not an organization user"
			});
		}
		go.database.Organization.findById(user.detail, function (err, organization) {
			if (err) {
				callback({
					success: false,
					message: "internal error"
				});
			}

			console.log("test");
			//console.log(newUserInfo["phone"]);
			if(newUserInfo["phone"] !== undefined){
				organization.phone = newUserInfo["phone"];
				//console.log(newUserInfo["mobile"]);
				organization.save(function(err){
					if (err) {
						callback({
							success: false,
							message: "update fail"
						});
					}
					console.log("ok");
				});
			}
			if(newUserInfo["desc"] !== undefined){
				organization.desc = newUserInfo["desc"];
				//console.log(newUserInfo["desc"]);
				organization.save(function(err){
					if (err) {
						callback({
							success: false,
							message: "update fail"
						});
					}
					console.log("ok");
				});
			}
			if(newUserInfo["email"] !== undefined){
				user.email = newUserInfo["email"];
				console.log(newUserInfo["email"]);
				user.save(function(err){
					if (err) {
						callback({
							success: false,
							message: "update fail"
						});
					}
				});
			}
			callback({
				success: true,
				message: "update successfully"
			});						
		});
	});
};

/*
 * publish a project
 * @param {String} username
 * @param {
 *   @param {String} name
 *   @param {String} desc
 *   @param {String} longDesc
 *   @param {String} notice
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
				name: projectInfo.name, 
				desc: projectInfo.desc, 
				longDesc: projectInfo.longDesc, 
				notice: projectInfo.notice, 
				moneyRaised: 0,
				moneyNeeded: projectInfo.moneyNeeded,
				mileStone: [{
					date: Date.now(),
					title: "项目发布日",
					desc: "我们的项目开始了"
				}],
				owner: user.detail
			});
			project.save(function(err, projectRes){
				if(err){
					callback({
						success: false,
						message:"internal error"
					});
				}

				// copy default img
				var readable = fs.createReadStream(path.join(__dirname, "../public/img/pj_default.jpg"));
				var writable = fs.createWriteStream(path.join(__dirname, "../public/img/pj_" + projectRes._id + ".jpg"));
				readable.pipe(writable);

				go.database.Organization.findByIdAndUpdate(
				{
					_id:user.detail
				},{
					$addToSet: 
					{
						project: projectRes._id
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
							message: projectRes._id
						});
					}
				});										
			});
		}
	});
}

/*
 * update project info
 * @param {
 *   @param {String} project
 *   @param {String} desc
 *   @param {String} longDesc
 *   @param {String} notice
 * } newProjectInfo
 * @return {Boolean} success
 */
OrganizationService.updateProject = function (newProjectInfo, callback) {
	go.database.Project.findById(newProjectInfo.project, function(err, project){
		if(err){
			console.log(err);
			callback({
				success: false,
				message: "internal error"
			});
		}
		project.desc = newProjectInfo.desc;
		project.longDesc = newProjectInfo.longDesc;
		project.notice = newProjectInfo.notice;
		project.save(function(err){
			if(err){
				console.log(err);
				callback({
					success: false,
					message: "internal error"
				});
			}
			callback({
				success: true,
				message: "update project successfully"
			});
		});
	});
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
 * @param {ObjectId} project id
 * @param {
 *   @param {String} date
 *   @param {Number} expense
 *   @param {String} usage
 * } expenditure
 * @return {Boolean} success
 */
OrganizationService.addExpenditure = function (projectID, expenditure, callback) {
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


/* @return {array of application}
 * 
 * need to contain the info of user(individual)
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
			var ids = [];
			for(var i = 0;i<applications.length;i++){
				console.log(applications[i].user._id);
				ids.push(applications[i].user._id.toString());
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
						var temp = {
							"application":{},
							"user":{}
						};
						for(var k = 0;k<ids.length;k++){
							if(ids[k] == users[i].detail){
								temp.user = users[i];
								temp.application = applications[k];
								console.log(temp);
								answer.push(temp);
								break;
							}
						}
					}
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
 * @return {array of user}
 * need to contain the info of (individual)
 */
OrganizationService.getVolunteerForProject = function(projectID, callback){
	go.database.Application.find({project: projectID, status: 1}).populate('user').exec(function(err, applications){
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
			var ids = [];
			for(var i = 0;i<applications.length;i++){
				console.log(applications[i].user._id);
				ids.push(applications[i].user._id.toString());
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
						var temp = {
							"user":{},
							"detail":{}
						};
						for(var k = 0;k<ids.length;k++){
							if(ids[k] == users[i].detail){
								temp.user = users[i];
								temp.detail = applications[k].user;
								console.log(temp);
								answer.push(temp);
								break;
							}
						}
					}
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


module.exports = OrganizationService;
