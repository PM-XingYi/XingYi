var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects'),
	OrganizationService = require('../service/OrganizationService'),
	ProjectService = require('../service/ProjectService');

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
router.param('id', /^\d+$/);

router.get('/home', passport.authenticate('local'), function(req, res) {
	res.render('dashboard_organization');
});

/*
 * PAGE: user PRIVATE profile
 */
router.get('/profile', passport.authenticate('local'), function(req, res) {
	OrganizationService.getUser(req.user.username, function (answer) {
		if (answer.success) {
			res.render('organization_profile', {
				user: answer.message
			});
		}
	});
});
/*
 * modify user profile
 * req.body.key is in []
 */
var keySet = ['mobile', 'email'];
router.post('/profile/edit', passport.authenticate('local'), function (req, res) {
	OrganizationService.updateUser(req.body, function(answer) {
		res.send(answer);
	});
});

/*
 * all project page
 */
router.get('/project', passport.authenticate('local'), function(req, res) {
	ProjectService.getOrganizationProject(req.user.username, function (result) {
		if (result.success) {
			res.render('organization_project_all', {project: result.message});
		}
	});
});
/*
 * one project page
 */
router.get('/project/:id', passport.authenticate('local'), function(req, res) {
	ProjectService.getProjectById(req.params.id, function (result) {
		if (result.success) {
			res.render('organization_project_all', {project: result.message});
		}
	});
});
/*
 * edit project page
 */
router.get('/project/:id/edit', passport.authenticate('local'), function(req, res) {
	ProjectService.getProjectById(req.params.id, function (result) {
		if (result.success) {
			res.render('organization_project_all', {project: result.message});
		}
	});
});
/*
 * edit project
 */
router.post('/project/:id/edit', passport.authenticate('local'), function(req, res) {
	OrganizationService.updateProject(req.body, function (result) {
		res.send(result);
	});
});

/*
 * [page]publish a project
 */
router.get('/publish', passport.authenticate('local'), function(req, res) {
	res.render('organization_publish');
});
router.post('/publish', passport.authenticate('local'), function(req, res) {
	OrganizationService.publishProject(req.user.username, req.body, function (result) {
		res.send(result);
	};
});

/*
 * manage milestone
 */
router.get('/project/:id/milestone', passport.authenticate('local'), function(req, res) {
	ProjectService.getProjectById(req.params.id, function (result) {
		if (result.success) {
			res.render('organization_project_milestone', result.message);
		}
	});
})；
router.post('/project/:id/milestone/add', passport.authenticate('local'), function(req, res) {
	OrganizationService.addMilestone(req.params.id, req.body, function (result) {
		res.send(result);
	});
});

/*
 * manage expenditure
 */
router.get('/project/:id/expenditure', passport.authenticate('local'), function(req, res) {
	ProjectService.getProjectById(req.params.id, function (result) {
		if (result.success) {
			res.render('organization_project_expenditure', result.message);
		}
	});
})；
router.post('/project/:id/expenditure/add', passport.authenticate('local'), function(req, res) {
	OrganizationService.addExpenditure(req.params.id, req.body, function (result) {
		res.send(result);
	});
});

/*
 * manage volunteer
 */
router.get('/project/:id/volunteer', passport.authenticate('local'), function(req, res) {
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
})；
router.post('/project/:id/volunteer/add', passport.authenticate('local'), function(req, res) {
	OrganizationService.examineApplication(req.body.applicationID, req.body.approve, function (result) {
		res.send(result);
	});
});

module.exports = router;
