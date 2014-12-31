var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects'),
	OrganizationService = require('../service/OrganizationService'),
	ProjectService = require('../service/ProjectService'),
	fs = require('fs');

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
					user: answer.message
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
 * req.body.key is in []
 */
var keySet = ['mobile', 'email'];
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
					project: result.message[0]
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
					project: result.message[0]
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
router.post('/project/:id/edit', function(req, res) {
	console.log("here");
	if (req.user && req.user.userType === 'organization') {
		var fstream;
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			console.log("Uploading: " + filename); 
			fstream = fs.createWriteStream(__dirname + '/files/' + filename);
			file.pipe(fstream);
			fstream.on('close', function () {
				res.redirect('back');
			});
		});
		
		console.dir(req);
		if (req.files && req.files.image !== 'undifined') {
			var tmpPath = req.files.iamge.path;
			var targetPath = './public/img/pj_' + req.user._id + ".jpg";
			fs.rename(tmpPath, targetPath, function(err) {
				if (err) {
					console.log(err);
				}
				fs.unlink(tmpPath, function() {
					if (err) {
						console.log(err);
					}
				});
			});
		}
		// OrganizationService.updateProject(req.body, function (result) {
		// 	res.send(result);
		// });
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
		res.render('organization_publish');
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
			if (result.success) {
				res.render('organization_project_milestone', result.message);
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
			if (result.success) {
				res.render('organization_project_expenditure', result.message);
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
		ProjectService.getUncheckedApplicationForProject(req.params.id, function (unchecked) {
			ProjectService.getVolunteerForProject(req.params.id, function (volunteer) {
				if (unchecked.success && volunteer.success) {
					var ans = {
						volunteerNum: volunteer.length,
						volunteer: volunteer,
						candidateNum: unchecked.length,
						candidate: unchecked
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
router.post('/project/:id/volunteer/add', function(req, res) {
	if (req.user && req.user.userType === 'organization') {
		OrganizationService.examineApplication(req.body.applicationID, req.body.approve, function (result) {
			res.send(result);
		});
	}
	else {
		res.status(203).end();
	}
});

module.exports = router;
