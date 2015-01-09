var go = require('../globalObjects'),
	mongoose = require('mongoose'),
	MD5 = require('MD5');

var Service = function () {
};



Service.registerSuperUser = function (callback) {
	var superUser = new go.database.SuperUser();
	superUser.save(function (err, superUser) {
		if (err) {
			console.log(err);
		}
		else {


			var user = new go.database.User({
				username: "superUser",
				password: MD5("password"),
				email: "super@super.com",
				userType: "superUser",
				detail: superUser._id
			});
			user.save(function (err) {
				if (err) {
					console.log(err);
				}
			});


			callback({
				success: true,
				superUserID: superUser._id
			});
		}
	});
};

/*
 * register an individual user
 * @param {String} username (unique)
 * @param {String} MD5 of password
 * @param {String} email
 * @param {String} mobile
 * @return {Boolean} success
 */
Service.registerUser = function (username, password, email, mobile, callback) {
	//check if user exists
	go.database.User.findOne({username: username}, function(err, user){
		if (err) {
			console.log("err");
		}
		if(user !== null){
			callback({
				success: false,
				message: "user already exists"
			});			

		} else{
			var ind = new go.database.Individual({mobile: mobile});
			ind.save(function (err, ind) {
				if (err) {
					console.log(err);
				}
				var user = new go.database.User({
					username: username,
					password: MD5(password),
					email: email,
					userType: "individual",
					detail: ind._id
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
};






Service.registerOrg = function (username, password, email, phone, desc, orgName, orgNumber, callback) {
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
				desc: desc,
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
							success: true,
							username: user.username
						});
					}
				});
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
Service.publishProject = function (username, projectInfo, callback) {
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
				longDesc:projectInfo.longDesc,
                notice:projectInfo.notice,  
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
							message: "publish successfully",
							projectID: project._id
						});
					}
				});	
									
			});
		}
	});
}


Service.watchProject = function (username, projectID, callback) {
	// check if userType is "individual"
	go.database.User.findOne({username: username},function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			if(user !== null){
				if(user.userType !== "individual"){
					callback({
						success: false,
						message: "not an individual user"
					});
				}else{
					go.database.Individual.findByIdAndUpdate(user.detail, 
					{
						$addToSet:
						{watchedProject: projectID}
					},function(err, result){
						if(err){
							callback({
								success: false,
								message: "watch failed"
							});
						}else{
							callback({
								success: true,
								message: "watch successfully"
							});
						}
					});
				}
			}else{
				callback({
					success: false,
					message: "user doesn't exist"
				});
			}			
		}
	});
}

/*
 * add project to user's join list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
Service.joinProject = function (username, projectID, joinReason, callback) {
	// check if userType is "individual"
	go.database.User.findOne({username: username},function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			if(user !== null){
				if(user.userType !== "individual"){
					callback({
						success: false,
						message: "not an individual user"
					});
				}else{
					//create a new application
					var application = new go.database.Application({
						user: user.detail,
						project: projectID,
						status:2,
						reason:joinReason
					});
					application.save(function(err){
						if(err){
							console.log(err);
							callback({
								success: false,
								message: "internal error"
							});
						}
						//add to individual's application list
						go.database.Individual.findByIdAndUpdate(user.detail, 
						{
							$addToSet:
							{
								application: application._id,
							}
						},function(err, result){
							if(err){
								callback({
									success: false,
									message: "join failed"
								});
							}
						});
						//add to project's joinedIndividual list
						go.database.Project.findByIdAndUpdate(projectID, 
						{
							$addToSet:
							{
								joinedIndividual: application._id,
							}
						},function(err, result){
							if(err){
								callback({
									success: false,
									message: "join failed"
								});
							}else{
								callback({
									success: true,
									message: "join successfully"
								});
							}
						});
					});					
				}
			}else{
				callback({
					success: false,
					message: "user doesn't exist"
				});
			}			
		}
	});
};




/*
 * add project to user's donation list
 * @param {String} username
 * @param {
 *   @param {ObjectId} project
 *   @param {Date} date
 *   @param {Number} amount
 *   @param {String} remark
 *   @param {Boolean} anonymous
 * } donation info
 * @return {Boolean} success
 */
Service.donateProject = function (username, donateInfo, callback) {
	go.database.User.findOne({username: username}, function(err, user) {
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			var donation = new go.database.Donation(
				{
					user: user.detail,
					project: donateInfo.project, 
					date: donateInfo.date, 
					amount: donateInfo.amount, 
					remark:donateInfo.remark, 
					anonymous:donateInfo.anonymous
				});
			donation.save(function(err,donation){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}
				var update = {
					$addToSet:
						{donation: donation._id},
					$inc:
						{moneyRaised:donation.amount}
					};
				go.database.Project.findByIdAndUpdate({_id: donateInfo.project},
					update, function(err,result){
						if(err){
							callback({
								success: false,
								message: "internal error"
							});
						}						
				});
				go.database.Individual.findByIdAndUpdate({_id: user.detail},
					{
						$addToSet:
						{donation: donation._id}
					}, function(err,result){
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
			});
		}
	});			
};


/*
 * add comment for user to project
 * @param {String} username
 * @param {
 *   @param {ObjectId} project id
 *   @param {Date} date
 *   @param {String} comment
 * } comment info
 * @return {Boolean} success
 */
Service.commentProject = function (username, commentInfo, callback) {
	go.database.User.findOne({username: username}, function(err, user) {
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			var comment = new go.database.Comment(
				{
					user: user.detail,
					project: commentInfo.project, 
					date: commentInfo.date, 
					comment: commentInfo.comment, 
				});
			comment.save(function(err,comment){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}
				go.database.Project.findByIdAndUpdate({_id: commentInfo.project},
					{
						$addToSet:
						{comment: comment._id}
					}, function(err,result){
						if(err){
							callback({
								success: false,
								message: "internal error"
							});
						}						
				});
				go.database.Individual.findByIdAndUpdate({_id: user.detail},
					{
						$addToSet:
						{comment: comment._id}
					}, function(err,result){
						if(err){
							callback({
								success: false,
								message: "internal error"
							});
						}
						callback({
							success: true,
							message: "true",
							commentID: comment._id
						});					
				});
			});
		}
	});	
};


/*
 * examine project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {Boolean} approve
 * @return {Boolean} success
 */
Service.examineProject = function (superUserID, projectID, approve, remark, callback) {
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
			
	});


	var pinfo = {project:projectID, approve:approve, remark:remark};


	go.database.SuperUser.update(
	{
		_id:superUserID
	},{
		$addToSet: 
		{
			projectExamine:pinfo
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
				message: "change the approved state successfully"
			});
		}
	});	
}

/*
 * examine comment
 * @param {String} username
 * @param {ObjectId} comment id
 * @param {Boolean} approve
 * @return {Boolean} success
 */
Service.examineComment = function (superUserID, commentID, approve, remark, callback) {
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
	});

	var cinfo = {comment:commentID, approve:approve, remark:remark};

	go.database.SuperUser.update(
	{
		_id:superUserID
	},{
		$addToSet: 
		{
			commentExamine:cinfo
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
				message: "change the approved state successfully"
			});
		}
	});	
};

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
Service.addMilestone = function (projectID, milestone, callback) {
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
Service.addExpenditure = function (projectID, expenditure, callback) {
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
Service.examineApplication = function (applicationID, approved, callback) {
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



module.exports = Service;
