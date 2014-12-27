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
/*	go.database.User.findOne({username: username}, function(err, user){
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
	go.database.User.findOne({username: "\"test02\""}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			var project = new go.database.Project({
				name:"pj04", 
				desc:"desc", 
				moneyNeeded: 800,
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
							message: result
						});
					}
				});										
			});
		}
	});
	go.database.Project.findByIdAndUpdate(
		{
			_id:"549ee621675f76a00bf5496a"
		},{
			$addToSet: 
			{
				mileStone:{
					date: Date.now,
					title: "test addMilestone",
					desc: "desc"
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
				console.log(result);
				callback({
					success: true,
					message: result
				});
			}
	});
	go.database.User.findOne({username: "\"test01\""},function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			console.log(user);
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
						{joinedProject: 
							{projectID: "549ee621675f76a00bf5496a",
								status: "wait"}
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
								message: result
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

	go.database.User.findOne({username: "\"test01\""}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		//console.log(user);
		go.database.Individual.findById({_id: user.detail},function(err, docs){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}
				console.log(docs.joinedProject.length);
				for(var i = 0;i< docs.joinedProject.length; i++){
					console.log(docs.joinedProject[i]);
					if(docs.joinedProject[i]._id.equals("549ee8e6fe6dc9f01ac9d62d")){
						console.log("match!!!!!!!!!!");
						docs.joinedProject[i].status = "pass";
						break;
					}
				}
				docs.save(function(err, docs){
					if(err){
						callback({
							success: false,
							message: "sava error"
						});
					}
					console.log(docs);
					go.database.Project.findByIdAndUpdate("549ee8e6fe6dc9f01ac9d62d", {
							$addToSet:
							{joinedIndividual: docs._id}
						},function(err, project){
							if(err){
								callback({
									success: false,
									message: "internal error"
								});
							}
							callback({
								success: true,
								message: project
							});
					});
				});			
		});
	});*/
	go.database.User.findOne({username: "\"test01\""},function(err, user){
		go.database.Individual.findById({_id: user.detail}).populate('joinedProject.project').exec(function(err, individual){
			if(err){
				callback({
					success: false
				});
			}
			console.log(individual);
			callback({
				success: true,
				message: individual
			});
		});
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
 * add milestone for a project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {String} title
 *   @param {String} desc
 * } milestone
 * @return {Boolean} success
 */
OrganizationService.addMilestone = function (username, projectID, milestone, callback) {
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
 * @param {Boolean} approved
 * @return {Boolean} success
 */
OrganizationService.examineCandidate = function (username, projectID, approved, callback) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		go.database.Individual.findById({_id: user.detail},function(err, docs){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}
				for(var i = 0;i< docs.joinedProject.length; i++){
					if(docs.joinedProject[i]._id === projectID){
						docs.joinedProject[i].status = approved;
						break;
					}
				}
				docs.save(function(err, docs){
					if(err){
						callback({
							success: false,
							message: "sava error"
						});
					}
					if(approved === "pass"){
						go.database.Project.findByIdAndUpdate(projectID, {
							$addToSet:
							{joinedIndividual: docs._id}
						},function(err, project){
							if(err){
								callback({
									success: false,
									message: "internal error"
								});
							}
							callback({
								success: true,
								message: "examineCandidate successfully"
							});
						});
					}else{
						callback({
							success: true,
							message: "examineCandidate successfully"
						});
					}
					
				});			
		});
	});
}

module.exports = OrganizationService;
