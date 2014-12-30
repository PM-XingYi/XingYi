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
	console.log('here');
	ProjectService.allPassedProject(function(project) {
		console.log(project);
		for (var i = 0; i < project.length; ++i) {
			if (project[i].moneyNeeded === -1) {
				project[i].ratio = -1;
			}
			else {
				project[i].ratio = project[i].moneyRaised / project[i].moneyNeeded;
			}
		}
		var ans = {
			curUser: req.user,
			total: project.length,
			project: project
		};
		console.log(ans);
		res.render('project_all', ans);
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
					total: latest.length,
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
	ProjectService.getProjectById(req.params.id, function(result) {
		if (result.success) {
			res.render('project_detail', result.message);
		}
	});
});

module.exports = router;
