var go = require('../globalObjects'),
	mongoose = require('mongoose'),
	MD5 = require('MD5');

var Service = function () {
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






Service.registerOrg = function (username, password, email, phone, orgName, orgNumber, callback) {
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
				owner: user.detail,
				approved: projectInfo.approved,
				remark


				
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
