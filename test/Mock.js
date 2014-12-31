var go = require('../globalObjects'),
	mongoose = require('mongoose'),
	MD5 = require('MD5'),
	assert = require("assert");
    service = require('../test/Service');

var Mock = function () {
};

var superUserID;
var userCount = 50;

Mock.insertSuperUser = function () {
	//check if user exists
	service.registerSuperUser(
				function(info) {
					assert.equal(info.success, true);
					console.log("insertSuperUser OK:"+info.superUserID);
					superUserID = info.superUserID;
				}
	);
};

Mock.insertUser = function () {
	//check if user exists
	var i;
	for (i=0;i<userCount;i++) {
		var username = "user"+i;
		service.registerUser(username, "password", "email@email.com", "13000000000",
					function(info) {
						assert.equal(info.success, true);
						console.log("insertUser OK:"+username);
					}
		);
	}
};

Mock.insertOrg = function () {
	//check if user exists
	var i;
	for (i=0;i<userCount/5;i++) {
		var username = "userForOrg"+i;
		var orgName = "org"+i;
		service.registerOrg(username, "password", "email@email.com", "13000000000", orgName, "15000000000",function(info) {
						assert.equal(info.success, true);
						console.log("insertOrg OK:"+orgName);
						Mock.insertPj(info.username)
					}					
		);
	}
};

Mock.insertPj = function (username) {
	//check if user exists
	var i;
	for (i=0;i<2;i++) {
		var projectInfo = {
			name:"pj"+i+"_"+username, 
			desc:"desc",
			longDesc:"longDesc",
			notice:"notice",
			moneyNeeded:-1
		};
		service.publishProject(username, projectInfo, function(info) {
						assert.equal(info.success, true);
						console.log("insertPj OK:"+projectInfo.name);
						Mock.checkProject(info.projectID);
						Mock.addWatch(info.projectID);
						Mock.addJoin(info.projectID);
						Mock.addComment(info.projectID);
					}	) ;
	}

	for (i=2;i<5;i++) {
		var projectInfo = {
			name:"pj"+i+"_"+username, 
			desc:"desc",
			longDesc:"longDesc",
			notice:"notice",
			moneyNeeded:1000*i
		};

		service.publishProject(username, projectInfo, function(info) {
						assert.equal(info.success, true);
						console.log("insertMoneyPj OK:"+projectInfo.name);
						Mock.checkProject(info.projectID, ((Math.random()*100)%2)*2+1);
						Mock.addWatch(info.projectID);
						Mock.addJoin(info.projectID);
						Mock.addDonate(info.projectID);
						Mock.addComment(info.projectID);
					}	) ;
	}
	
};

Mock.addWatch = function (projectID) {
	//check if user exists
	var j;
	for (j=0;j<userCount/3;j++) {
			var username = "user"+j;

			service.watchProject(username, projectID, function(info) {
						assert.equal(info.success, true);
						
					}	)	;	
	}
	console.log("watchok:"+projectID);
};

Mock.addJoin = function (projectID) {
	var j;
	for (j=userCount/3;j<userCount*2/3;j++) {
			var username = "user"+j;

			service.joinProject(username, projectID, "like it", function(info) {
						assert.equal(info.success, true);
						
					}	)		;
	}
	console.log("joinok:"+projectID);
}

Mock.addDonate = function(projectID) {
	var j;
	for (j=userCount*2/3;j<userCount;j++) {
			var username = "user"+j;
			var donateInfo = {
					project: projectID,
					date: new Date(), 
					amount: 10, 
					remark:"hello world", 
					anonymous:true
	
			};
			service.donateProject(username, donateInfo, function(info) {
						assert.equal(info.success, true);
						
					}	)		;
	}
	for (j=0;j<userCount/4;j++) {
			var username = "user"+j;
			var donateInfo = {
					project: projectID,
					date: new Date(), 
					amount: 10, 
					remark:"bye world", 
					anonymous:false
	
			};
			service.donateProject(username, donateInfo, function(info) {
						assert.equal(info.success, true);
					}	)		;
	}
	console.log("donateok:"+projectID);
}

Mock.addComment = function(projectID) {
	var j;
	for (j=userCount/4;j<userCount/2;j++) {
			var username = "user"+j;
			var commentInfo = {
					project: projectID,
					date: new Date(), 
					comment:"very good very good very good very good"
	
			};
			service.commentProject(username, commentInfo, function(info)
			{
				assert.equal(info.success, true);
				Mock.checkComment(info.commentID, ((Math.random()*100)%2)*2+1);
				
			});	
	}
	console.log("commentok:"+projectID);
};

Mock.checkProject = function(projectID, approve) {
	var remark = "";
	if (approve == 3) {
		remark = "declined";
	}
	service.examineProject(superUserID, projectID, approve, remark, function(info)
			{
				assert.equal(info.success, true);
				console.log("checkPJ ok:"+projectID+", "+approve);
			}); 
};

Mock.checkComment = function(commentID, approve) {
	var remark = "";
	if (approve == 3) {
		remark = "declined";
	}
	service.examineComment(superUserID, commentID, approve, remark, function(info)
			{
				assert.equal(info.success, true);
				console.log("checkComment ok:"+commentID+", "+approve);
			}); 
};

module.exports = Mock;
