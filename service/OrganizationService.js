var go = require('../globalObjects');
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
OrganizationService.prototype.register = function (username, password, email, phone, orgName, orgNumber) {
	//check if user exists
	go.database.User.findOne({username: username}, function(err, user){
		if(user !== null){
			callback({
				success:false,
				message: "user already exists"
			});
		} else{
			var newUser = new User(username, password, email,"Organization", phone, orgName,orgNumber);
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
}
/*
 * return user info by username
 * @param {String} username
 * @return {Individual} user
 */
OrganizationService.prototype.getUser = function (username) {

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
OrganizationService.prototype.publishProject = function (username, projectInfo) {
	var id = new mongoose.Schema.ObjectId() ;
	go.database.User.findOne({username: username}, function(err, user){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		}else {
			go.database.Project.insert({_id: id, name:projectInfo.name, desc:projectInfo.desc, moneyNeeded: projectInfo.moneyNeeded, owner: user.detail}. function(err, result){
				if(err){
					callback({
						success: false,
						message:"internal error"
					});
				}else {
					go.database.Organization.update({_id:user.detail},{"$addToSet",{"project": id}}, function(err, result){
						if(err){
							callback({
								success: false,
								message:"internal error"
							});
						}else {
							callback({
								success: true,
								message: "publish successfully"
							});
						}
					});
			
				}
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
OrganizationService.prototype.addMilestone = function (username, projectID, milestone) {
	// organization user can only add milestones from it's own page, 
	//so don't check the owner of the projectID is this organization
	
	go.database.Project.findById(projectID, function(err, project){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		} else {
			go.database.Project.update({project: project},{"$addToSet":{mileStone: {
				date: milestone.date,
				title: milestone.title,
				desc: milestone.desc
			}}}, function(err, result){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
							
				} else {
					callback({
						success: true,
						message:" add milestone successfully"
					});
				}
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
OrganizationService.prototype.addExpenditure = function (username, projectID, expenditure) {
	go.database.Project.findById(projectID, function(err, project){
		if(err){
			callback({
				success: false,
				message: "internal error"
			});
		} else {
			go.database.Project.update({project: project},{"$addToSet":{expenditure: {
				date: expenditure.date,
				expense: expenditure.expense,
				usage: expenditure.usage
			}}}, function(err, result){
				if(err){
					callback({
						success: false,
						message: "internal error"
					});
							
				} else {
					callback({
						success: true,
						message:" add milestone successfully"
					});
				}
			});
		}
	});
}
