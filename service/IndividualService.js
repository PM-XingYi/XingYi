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
 * seem exist problem!!!!!!!!!!!!!!!
 */
IndividualService.getWatchProjectList = function (username, callback) {
	go.database.User.findOne({username: username},function(err, user){
		go.database.Individual.findById({_id: user.detail}).populate('watchedProject').exec(function(err, individual){
			if(err){
				callback({
					success: false
				});
			}
			console.log(individual.watchedProject);
			callback({
				success: true,
				message: individual.watchedProject
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
IndividualService.joinProject = function (username, projectID, callback) {
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
						{joinedProject: 
							{projectID: projectID,
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
								message: "join successfully"
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
};
/*
 * delete project to user's join list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.cancelJoinProject = function (username, projectID, callback) {
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
					{joinedProject: projectID}
				},
				function(err, result){
					if(err){
						callback({
							success: false,
							message: "cancel join failed"
						});
					}else{
						callback({
							success: true,
							message: "cancel join successfully"
						});
					}
			});
		}
	});
};
/*
 * get user's join list
 * @param {String} username
 * @return {Array of Project} project list
 */
IndividualService.getJoinProjectList = function (username, callback) {
	go.database.User.findOne({username: username},function(err, user){
		go.database.Individual.findById({_id: user.detail}).populate('joinedProject').exec(function(err, individual){
			if(err){
				callback({
					success: false
				});
			}
			console.log(individual.joinedProject);
			callback({
				success: true,
				message: individual.joinedProject
			});
		});
	});
};


/*
 * add project to user's donation list
 * @param {String} username
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {Number} amount
 *   @param {String} remark
 *   @param {Boolean} anonymous
 * } donation info
 * @return {Boolean} success
 */
IndividualService.donateProject = function (username, projectID, donateInfo, callback) {
	go.database.User.findOne({username: username}, function(err, user) {
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			var donation = go.database.Donation(
				{
					user: user._id,
					project: projectID, 
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
				go.database.Project.findByIdAndUpdate({_id: projectID},
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
							message: "donate successfully"
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
		go.database.Individual.findById({_id: user.detail}).populate('donation').exec(function(err, individual){
			if(err){
				callback({
					success: false
				});
			}
			console.log(individual.donation);
			callback({
				success: true,
				message: individual.donation
			});
		});
	});
};


/*
 * add comment for user to project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {String} comment
 * } comment info
 * @return {Boolean} success
 */
IndividualService.commentProject = function (username, projectID, commentInfo, callback) {
	go.database.User.findOne({username: username}, function(err, user) {
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			var comment = go.database.Comment(
				{
					user: user._id,
					project: projectID, 
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
				go.database.Project.findByIdAndUpdate({_id: projectID},
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
							message: "comment successfully"
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
		go.database.Individual.findById({_id: user.detail}).populate('comment').exec(function(err, individual){
			if(err){
				callback({
					success: false
				});
			}
			console.log(individual.comment);
			callback({
				success: true,
				message: individual.comment
			});
		});
	});
};


module.exports = IndividualService;

