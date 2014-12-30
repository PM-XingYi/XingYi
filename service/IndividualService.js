var go = require('../globalObjects'),
	mongoose = require('mongoose'),
	MD5 = require('MD5');

var IndividualService = function () {
};

/*
 * register an individual user
 * @param {String} username (unique)
 * @param {String} MD5 of password
 * @param {String} email
 * @param {String} mobile
 * @return {Boolean} success
 */
IndividualService.register = function (username, password, email, mobile, callback) {
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

/*
 * Return user info by username
 * @param {String} username
 * @return {Individual} user
 */
IndividualService.getUser = function (username, callback) {
	go.database.User.findOne({username: username}, function (err, user) {
		if (err) {
			callback({
				success: false,
				message: "internal error"
			});
		} else {
			var answer = JSON.parse(JSON.stringify(user));
			go.database.Individual.findById(user.detail, function (err, individual) {
				if (err) {
					callback({
						success: false,
						message: "internal error"
					});
				} else {
					answer.detail = individual;
					console.log(answer);
					callback({
						success: true,
						message: answer
					});
				}
			});
		}
	});
};

/*
 * update user info
 * @param {Individual} newUserInfo
 * @return {Boolean} success
 */
IndividualService.updateUser = function (newUserInfo, callback) {
	go.database.User.findOne({username: newUserInfo.username}, function (err, user) {
		if (user.userType !== 'individual') {
			callback({
				success: false,
				message: "not an individual user"
			});
		}
		go.database.Individual.findById(user.detail, function (err, individual) {
			if (err) {
				callback({
					success: false,
					message: "internal error"
				});
			}
			for (var i = 0; i < keySet.length; ++i) {
				if (keySet[i] === req.body.key) {
					individual[keySet[i]] = req.body.value;
					individual.save(function (err) {
						if (err) {
							callback({
								success: false,
								message: "update fail"
							});
						}
						callback({
							success: true,
							message: "success"
						});
					});
					return;
				}
			}
			callback({
				success: false,
				message: "illegal key"
			});
		});
	});
};


/*
 * add project to user's watch list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.watchProject = function (username, projectID, callback) {
	// check if userType is "individual"
	go.database.User.findOne({username: username},function(err, user){
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
 * delete project from user's watch list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.cancelWatchProject = function (username, projectID, callback) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			go.database.Individual.findByIdAndUpdate(user.detail, 
				{
					$pull:
					{watchedProject: projectID}
				},
				function(err, result){
					if(err){
						callback({
							success: false,
							message: "cancel watch failed"
						});
					}else{
						callback({
							success: true,
							message: "cancel watch successfully"
						});
					}
			});
		}
	});
}

			
/*
 * get user's watch list
 * @param {String} username
 * @return {Array of Project} project list
 */
IndividualService.getWatchProjectList = function (username, callback) {
	go.database.User.findOne({username: username},function(err, user){
		go.database.Individual.findById(user.detail).populate('watchedProject').exec(function(err, individual){
			if(err){
				callback({
					success: false
				});
			}
			var answer = [];
			if(individual === null || individual === undefined){
				console.log(individual);
			}else{
				answer = individual.watchedProject;
			}
			console.log(answer);

			callback({
				success: true,
				message: answer
			});
		});
	});
};


/*
 * add project to user's join list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.joinProject = function (username, projectID, joinReason, callback) {
	// check if userType is "individual"
	go.database.User.findOne({username: username},function(err, user){
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
					//create a new application
					var application = new go.database.Application({
						user: user.detail,
						project: projectID,
						status:2,
						reson:joinReason
					});
					application.save(function(err){
						if(err){
							console.log(err);
							callback({
								success: false,
								message: "internal error"
							});
						}
						console.log(application);
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
 * get user's join list
 * @param {String} username
 * @return {Array of Application} application list
 */
IndividualService.getJoinProjectList = function (username, callback) {
	go.database.User.findOne({username: username},function(err, user){
		go.database.Individual.findById({_id: user.detail},function(err, individual){
			if(err){
				callback({
					success: false,
					message: "internal error"
				});
			}
			if(individual === null || individual === undefined){
				callback({
					success: false,
					message: "cannot find the individual"
				});
			}else{
				go.database.Application.find({user: individual._id}).populate('project').exec(function(err, application){
				if(err){
					console.log(err);
					callback({
						success: false,
						message: "internal error"
					});
				}
				var answer = [];
				if(application === null || application == undefined){
					console.log(application);
				}else{
					answer = application;
				}
				console.log(answer);
				callback({
					success: true,
					message: answer
					});
				});			
			}			
		});		
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
IndividualService.donateProject = function (username, donateInfo, callback) {
	go.database.User.findOne({username: username}, function(err, user) {
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			var donation = new go.database.Donation(
				{
					user: user._id,
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
 * get user's donation list
 * @param {String} username
 * @return {Array of Donation} donation list
 */
IndividualService.getDonateProjectList = function (username, callback) {
	go.database.User.findOne({username: username},function(err, user){
		if(err){
			console.log(err);
			callback({
				success: false,
				message: "internal error"
			});
		}
		go.database.Individual.findById({_id: user.detail}).populate('donation').exec(function(err, individual){
			if(err){
				console.log(err);
				callback({
					success: false
				});
			}
			var answer = [];
			if(individual === null || individual == undefined){
				console.log(individual);
			}else{
				answer = individual.donation;
			}
			console.log(answer);
			callback({
				success: true,
				message: answer
			});
		});
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
IndividualService.commentProject = function (username, commentInfo, callback) {
	go.database.User.findOne({username: username}, function(err, user) {
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			var comment = new go.database.Comment(
				{
					user: user._id,
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
							message: "true"
						});					
				});
			});
		}
	});	
};
/*
 * get user's comment list
 * @param {String} username
 * @return {Array of Comment} comment list
 */
IndividualService.getCommentProjectList = function (username, callback) {
	go.database.User.findOne({username: username},function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}
		go.database.Individual.findById({_id: user.detail}).populate('comment').exec(function(err, individual){
			if(err){
				callback({
					success: false
				});
			}
			var answer = [];
			if(answer === null || answer === undefined){
				console.log(individual);
			}else{
				answer = individual.comment;
			}		
			callback({
				success: true,
				message: answer
			});
		});
	});
};


module.exports = IndividualService;

