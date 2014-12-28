var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects'),
	OrganizationService = require('../service/OrganizationService');

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
	ProjectService.getOrganizationProject(req.user.username, function (result) {
		if (result.success) {
			res.render('organization_project_all', {project: result.message});
		}
	});
});

/*
 * add a milestone
 */
router.post('/milestone/add', passport.authenticate('local'), function(req, res) {
});

/*
 * add an expenditure
 */
router.post('/expenditure/add', passport.authenticate('local'), function(req, res) {
});

module.exports = router;
