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
IndividualService.prototype.register = function (username, password, email, mobile,callback) {
	//check if user exists
	go.database.User.findOne({username: username}, function(err, user){
		if(user !== null){
			callback({
				success:false,
				message: "user already exists"
			});
		} else{
			var id = new mongoose.Schema.ObjectId() ;
			var newIndividual = new go.database.Individual(id,mobile);
			var newUser = new User(username, password, email, id);
			go.database.Individual.save(function(err,newIndividual, numberAffected){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else if(numberAffected == 1){
					callback({
						success: false,
						message: "insert individual failed"
					});
				}else{
					go.database.User.save(function(err, newUser, numberAffected)){
						if(err){
							callback({
								success: false,
								message: "internal error"
							});
						}else if(numberAffected == 1){
							callback({
								success: false,
								message: "insert user failed"
							});
						}else{
							callback({
								success：true,
								message: "register successfully"
							});
						}
				}
				});
			});
		}
	);
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
 * update user info
 * @param {Individual} newUserInfo
 * @return {Boolean} success
 */
IndividualService.prototype.updateUser = function (newUserInfo, callback) {
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
}


/*
 * add project to user's watch list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.prototype.watchProject = function (username, projectID, callback) {
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
						go.database.Individual.update({
							individual: individual
						},{
							$addToSet: {
								"watchedProject":projectID
							}
						},function(err, result){
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
				);
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
						go.database.Individual.update({
							individual: individual
						},{
							$addToSet: {
								"joinedProject":projectID
							}
						},function(err, result){
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
	go.database.User.findOne({username: username}, function(err, user) {
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			var id = new mongoose.Schema.ObjectId() ;
			go.database.Donation.insertOne({_id:id, user: user, project: projectID, date: donateInfo.date, 
				amount: donateInfo.amount, remark:donateInfo.remark, anonymous:donateInfo.anonymous}, function(err, result){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else{
					if(result === 1){
						go.database.User.update({
							_id: user.detail
						},{
							$addToSet: {
								"donation": id
							}
						}, function(err, result){
							if(err){
								callback({
									success: false,
									message: "internal error"
								});
							}else {
								callback({
									success: true,
									message: "donate successfully"
								})
							}
						});						
					}
				}					
			});
		}
	});
	
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
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else{
			var id = new mongoose.Schame.ObjectId() ;
			go.database.Donation.insertOne({_id:id, user: user, project: projectID, date: commentInfo.date, 
				comment: commentInfo.comment}, function(err, result){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
				}else{
					if(result === 1){
						go.database.User.update({
							_id: user.detail
						},{
							$addToSet: {
								"comment": id
							}
						}, function(err, result){
							if(err){
								callback({
									success: false,
									message: "internal error"
								});
							}else {
								callback({
									success: true,
									message: "comment successfully"
								})
							}
						});						
					}
				}					
			});
		}
	});
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