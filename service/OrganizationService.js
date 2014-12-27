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
			go.database.Project.save(function(err, project){
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
	var startDay = new Date().Format("yyyy-MM-dd HH:mm:ss");
	go.database.Project.findByIdAndUpdate(
		{
			_id:projectID
		},{
			$addToSet: 
			{
				mileStone:{
					startDay:startDay,
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

module.exports = OrganizationService;
