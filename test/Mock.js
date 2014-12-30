var go = require('../globalObjects'),
	mongoose = require('mongoose'),
	MD5 = require('MD5'),
	assert = require("assert");

var Mock = function () {
};


Mock.insertUser = function () {
	//check if user exists
	var individualService = require('../service/IndividualService');
	var i;
	for (i=0;i<100;i++) {
		var username = "user"+i;
		individualService.register(username, "password", "email@email.com", "13000000000",
					function(info) {
						console.log(info.success);
						assert.equal(info.success, true);
						console.log("insertUserOK:"+username);
					}
		);
	}
};

Mock.insertOrg = function () {
	//check if user exists
	var organizationService = require('../service/OrganizationService');
	var i;
	for (i=0;i<10;i++) {
		var username = "userForOrg"+i;
		var orgName = "org"+i;
		organizationService.register(username, "password", "email@email.com", "13000000000", orgName, "15000000000",function(info) {
						assert.equal(info.success, true);
						console.log("insertOrg:"+orgName);
						Mock.insertPj(info.username)
					}					
		);
	}
};

Mock.insertPj = function (username) {
	//check if user exists
	var organizationService = require('../service/OrganizationService');
	var i,j;
	for (i=0;i<5;i++) {
		var projectInfo = {name:"pj"+i+"_"+username, desc:"desc",moneyNeeded:1000*i};

		organizationService.publishProject(username, projectInfo, function(info) {
						assert.equal(info.success, true);
						console.log("insertPj:"+projectInfo.name);
						Mock.addRelation(info.projectID);
					}	) ;
	}
	
};

Mock.addRelation = function (projectID) {
	//check if user exists
	var organizationService = require('../service/OrganizationService');
	var individualService = require('../service/IndividualService');
	var i,j;
	for (j=0;j<30;j++) {
			var username = "user"+j;

			individualService.watchProject(username, projectID, function(info) {
						assert.equal(info.success, true);
						console.log("watchok:");
					}	)	;	
	}
	for (j=15;j<50;j++) {
			var username = "user"+j;

			individualService.joinProject(username, projectID, function(info) {
						assert.equal(info.success, true);
						console.log("joinok:");
					}	)		;
	}
	for (j=15;j<30;j++) {
			var username = "user"+j;
			var donateInfo = {
					date: new Date(), 
					amount: 10, 
					remark:"hello world", 
					anonymous:true
	
			};
			individualService.donateProject(username, projectID, donateInfo, function(info) {
						assert.equal(info.success, true);
						console.log("joinok:");
					}	)		;
	}
	for (j=30;j<50;j++) {
			var username = "user"+j;
			var donateInfo = {
					date: new Date(), 
					amount: 10, 
					remark:"bye world", 
					anonymous:false
	
			};
			individualService.donateProject(username, projectID, donateInfo, function(info) {
						assert.equal(info.success, true);
						console.log("donateok:");
					}	)		;
	}

	for (j=40;j<80;j++) {
			var username = "user"+j;
			var commentInfo = {
					date: new Date(), 
					comment:"very good very good very good very good"
	
			};
			individualService.commentProject(username, projectID, commentInfo, function(info) 						{
						assert.equal(info.success, true);
						console.log("commentok:");
					}	)	;	
	}
};

module.exports = Mock;
