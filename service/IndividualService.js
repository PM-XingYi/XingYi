var go = require('../globalObjects');

var IndividualService = function () {
}

/*
 * register an individual user
 * @param {String} username (unique)
 * @param {String} MD5 of password
 * @param {String} email
 * @param {String} mobile
 * @return {Boolean} success
 */
IndividualService.prototype.register = function (username, password, email, mobile) {
	//check if user exists
	go.database.User.findOne({username: username}, function(err, user){
		if(user !== null){
			callback({
				success:false,
				message: "user already exists"
			});
		} else{
			var newUser = new User(username, password, email, mobile);
			go.database.User.insertOne({user: newUser}, function(err, result){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else{
					callback({
						success: true,
						message: result
					});
				}
			});
		}
	});
};


/*
 * Return user info by username
 * @param {String} username
 * @return {Individual} user
 */
IndividualService.prototype.getUser = function (username, callback) {
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
 * add project to user's watch list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.prototype.watchProject = function (username, projectID) {
	// check if userType is "individual"
	go.database.User.findOne({username: username},function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			if(user.userType !== "individual"){
				callback({
					success: false,
					message: "not an individual user"
				});
			}else{
				go.database.Individual.findById(user.detail, function(err, individual){
					if(err){
						callback({
							success: false,
							message: "internal error"
						});
					}else{
						go.database.Individual.update({individual: individual},{"$addToSet":{"watchedProject":projectID}},function(err, result){
							if(err){
								callback({
									success: false,
									message: "internal error or already joined"
								});
							}else{
								callback({
									success: true,
									message: result
								});
							}
						});
					}
				});
			}
		}
	});
};
/*
 * delete project from user's watch list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.prototype.cancelWatchProject = function (username, projectID) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			go.database.Individual.findById(user.detail, function(err, individual){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else {
					go.database.Individual.update({individual: individual}, {"$pull":{"watchedProject":projectID}}, function(err, result){
						if(err){
							callback({
								success: false,
								message: "internal error"
							});
						}else{
							callback({
								success: true,
								message: result
							});
						}
					});
				}
			});
		}
	});
};
/*
 * get user's watch list
 * @param {String} username
 * @return {Array of Project} project list
 */
IndividualService.prototype.getWatchProjectList = function (username) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			go.database.Individual.findById(user.detail, function(err, individual){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else{
					go.database.Individual.find({individual: individual}, {"watchedProject": 1}, function(err, watchedProject){
						if(err){
							callback({
							success: false,
							message: "internal error"
							});
						}else{
							var answer = JSON.parse(JSON.stringify(watchedProject));
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
};


/*
 * add project to user's join list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.prototype.joinProject = function (username, projectID) {
	// check if userType is "individual"
	go.database.User.findOne({username: username},function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			if(user.userType !== "individual"){
				callback({
					success: false,
					message: "not an individual user"
				});
			}else{
				go.database.Individual.findById(user.detail, function(err, individual){
					if(err){
						callback({
							success: false,
							message: "internal error"
						});
					}else{
						go.database.Individual.update({individual: individual},{"$addToSet":{"joinedProject":projectID}},function(err, result){
							if(err){
								callback({
									success: false,
									message: "internal error or already joined"
								});
							}else{
								callback({
									success: true,
									message: result
								});
							}
						});
					}
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
IndividualService.prototype.cancelJoinProject = function (username, projectID) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			go.database.Individual.findById(user.detail, function(err, individual){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else {
					go.database.Individual.update({individual: individual}, {"$pull":{"joinedProject":projectID}}, function(err, result){
						if(err){
							callback({
								success: false,
								message: "internal error"
							});
						}else{
							callback({
								success: true,
								message: result
							});
						}
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
IndividualService.prototype.getJoinProjectList = function (username) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			go.database.Individual.findById(user.detail, function(err, individual){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else{
					go.database.Individual.find({individual: individual}, {"joinedProject": 1}, function(err, joinedProject){
						if(err){
							callback({
							success: false,
							message: "internal error"
							});
						}else{
							var answer = JSON.parse(JSON.stringify(joinedProject));
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
IndividualService.prototype.donateProject = function (username, projectID, donateInfo) {
	go.database.User.findOne({username: username}, function(err, user)){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			go.database.Donation.insertOne({user: user, project: projectID, date: donateInfo.date, 
				amount: donateInfo.amount, remark:donateInfo.remark, anonymous:donateInfo.anonymous}, function(err, result){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else{
					if(result === 1){
						
					}
				}					
			});
		}
	}
	
};
/*
 * get user's donation list
 * @param {String} username
 * @return {Array of Donation} donation list
 */
IndividualService.prototype.getDonateProjectList = function (username) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			go.database.Individual.findById(user.detail, function(err, individual){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else{
					go.database.Individual.find({individual: individual}, {"donation": 1}, function(err, donation){
						if(err){
							callback({
							success: false,
							message: "internal error"
							});
						}else{
							var answer = JSON.parse(JSON.stringify(donation));
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
IndividualService.prototype.commentProject = function (username, projectID, commentInfo) {

};
/*
 * get user's comment list
 * @param {String} username
 * @return {Array of Comment} comment list
 */
IndividualService.prototype.getCommentProjectList = function (username) {
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			go.database.Individual.findById(user.detail, function(err, individual){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else{
					go.database.Individual.find({individual: individual}, {"comment": 1}, function(err, comment){
						if(err){
							callback({
							success: false,
							message: "internal error"
							});
						}else{
							var answer = JSON.parse(JSON.stringify(comment));
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
};