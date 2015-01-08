var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects'),
	OrganizationService = require('../service/OrganizationService'),
	ProjectService = require('../service/ProjectService'),
	fs = require('fs'),
	path = require('path');

router.param(function(name, fn){
	if (fn instanceof RegExp) {
		return function(req, res, next, val){
			var captures;
			if (captures = fn.exec(String(val))) {
				req.params[name] = captures;
				next();
			} else {
				next('route');
			}
		}
	}
});
router.param('id', /^\w+$/);

router.get('/home', function(req, res) {
	console.log(req.user);
	if (req.user && req.user.userType === 'organization') {
		res.render('organization_dashboard', {
			curUser: req.user
		});
	}
	else {
		res.status(203).end();
	}
});

/*
 * PAGE: user PRIVATE profile
 */
router.get('/profile', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		OrganizationService.getUser(req.user.username, function (answer) {
			if (answer.success) {
				res.render('organization_profile', {
					curUser: req.user,
					organization: answer.message
				});
			}
		});
	}
	else {
		res.status(203).end();
	}
});
/*
 * modify user profile
 */
router.post('/profile/edit', function (req, res) {
	if (req.user && req.user.userType === 'organization') {
		OrganizationService.updateUser(req.user.username, req.body, function(answer) {
			res.send(answer);
		});
	}
	else {
		res.status(203).end();
	}
});

/*
 * all project page
 */
router.get('/project', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		ProjectService.getOrganizationProject(req.user.username, function (result) {
			for (var i = 0; i < result.message.length; ++i) {
				if (result.message[i].moneyNeeded === -1) {
					result.message[i].ratio = -1;
				}
				else {
					result.message[i].ratio = (result.message[i].moneyRaised / result.message[i].moneyNeeded).toFixed(2);
				}
			}
			if (result.success) {
				res.render('organization_project_all', {
					curUser: req.user,
					project: result.message
				});
			}
		});
	}
	else {
		res.status(203).end();
	}
});
/*
 * one project page
 */
router.get('/project/:id', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		ProjectService.getProjectById(req.params.id, function (result) {
			if (result.success) {
				res.render('organization_project_detail', {
					curUser: req.user,
					project: result.message,
					today: new Date().toISOString().substr(0, 10)
				});
			}
		});
	}
	else {
		res.status(203).end();
	}
});
/*
 * edit project page
 */
router.get('/project/:id/edit', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		ProjectService.getProjectById(req.params.id, function (result) {
			if (result.success) {
				res.render('organization_project_edit', {
					curUser: req.user,
					project: result.message
				});
			}
		});
	}
	else {
		res.status(203).end();
	}
});
/*
 * edit project
 */
router.post('/project/:id/editImg', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		var fstream;
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			console.log("Uploading: " + filename); 
			fstream = fs.createWriteStream(path.join(__dirname, '../public/img/pj_' + req.params.id + ".jpg"));
			file.pipe(fstream);
			fstream.on('close', function () {
				res.send({ success: true });
			});
		});
	}
	else {
		res.status(203).end();
	}
});
router.post('/project/:id/edit', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		console.log(req.body);
		OrganizationService.updateProject(req.body, function (result) {
			res.send(result);
		});
	}
	else {
		res.status(203).end();
	}
});

/*
 * [page]publish a project
 */
router.get('/publish', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		res.render('organization_publish', req.user);
	}
	else {
		res.status(203).end();
	}
});
router.post('/publish', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		OrganizationService.publishProject(req.user.username, req.body, function (result) {
			res.send(result);
		});
	}
	else {
		res.status(203).end();
	}
});

/*
 * manage milestone
 */
router.get('/project/:id/milestone', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		ProjectService.getProjectById(req.params.id, function (result) {
			var ans = {
				curUser: req.user,
				project: result.message
			};

			if (result.success) {
				res.render('organization_project_milestone', ans);
			}
		});
	}
	else {
		res.status(203).end();
	}
});
router.post('/project/:id/milestone/add', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		OrganizationService.addMilestone(req.params.id, req.body, function (result) {
			res.send(result);
		});
	}
	else {
		res.status(203).end();
	}
});

/*
 * manage expenditure
 */
router.get('/project/:id/expenditure', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		ProjectService.getProjectById(req.params.id, function (result) {
			var ans = {
				curUser: req.user,
				project: result.message
			};

			if (result.success) {
				res.render('organization_project_expenditure', ans);
			}
		});
	}
	else {
		res.status(203).end();
	}
});
router.post('/project/:id/expenditure/add', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		OrganizationService.addExpenditure(req.params.id, req.body, function (result) {
			res.send(result);
		});
	}
	else {
		res.status(203).end();
	}
});

/*
 * manage volunteer
 */
router.get('/project/:id/volunteer', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		OrganizationService.getUncheckedApplicationForProject(req.params.id[0], function (unchecked) {
			OrganizationService.getVolunteerForProject(req.params.id[0], function (volunteer) {
				if (unchecked.success && volunteer.success) {
					var ans = {
						curUser: req.user,
						volunteerNum: volunteer.message.length,
						volunteer: volunteer.message,
						candidateNum: unchecked.message.length,
						candidate: unchecked.message
					}
					res.render('organization_project_volunteer', ans);
				}
			});
		});
	}
	else {
		res.status(203).end();
	}
});
router.post('/examApp', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		OrganizationService.examineApplication(req.body.application, req.body.approve, function (result) {
			res.send(result);
		});
	}
	else {
		res.status(203).end();
	}
});

module.exports = router;
