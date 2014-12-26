var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects'),
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

/*
 * get all available project
 */
router.get('/all', function (req, res) {
	ProjectService.allPassedProject(function(project) {
		var ans = {
			total: project.length,
			project: project
		};
		res.render('view_all_no_login', ans);
	});
});

/*
 * search project
 */
router.post('/search', function (req, res) {
	ProjectService.searchProject(req.body.keyword, function(result) {
		// no result, render search_nofound page
		if (result.length === 0) {
			ProjectService.latestProject(3, function(latest) {
				var ans = {
					keyword: req.body.keyword,
					latest: latest
				};
				res.render('search_nofound', ans);
			});
		}
		// result found
		else {
			var ans = {
				keyword: req.body.keyword,
				project: result
			};
			res.render('search_result', ans);
		}
	});
});

/*
 * get one available project
 */
router.get('/:id', function (req, res) {
});

/*
 * get latest n available project
 */
router.get('/latest', function (req, res) {
});

/*
 * get available comments of a available project
 */
router.get('/:id/comment', function (req, res) {
});

/*
 * get all joined individual of a project
 */
router.get('/:id/joinedIndividual', passport.authenticate('local'), function(req, res) {
});

/*
 * get all donation of a project
 */
router.get('/:id/donation', passport.authenticate('local'), function(req, res) {
});

/*
 * publish a project
 */
router.post('/publish', passport.authenticate('local'), function(req, res) {
});

module.exports = router;
