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
router.param('id', /^\w+$/);

/*
 * get all available project
 */
router.get('/all', function (req, res) {
	ProjectService.getAllProjectByStatus(2, function(result) {
		if (!result.success) {
			res.send(result);
		}
		var project = result.message;
		console.log(project);
		console.log(project.length);
		for (var i = 0; i < project.length; ++i) {
			if (project[i].moneyNeeded === -1) {
				project[i].ratio = -1;
			}
			else {
				project[i].ratio = (project[i].moneyRaised / project[i].moneyNeeded).toFixed(2);
			}
		}
		var ans = {
			curUser: req.user,
			total: project.length,
			project: project
		};
		// console.log(ans);
		res.render('project_all', ans);
	});
});

/*
 * search project
 */
router.get('/search', function (req, res) {
	ProjectService.searchProject(req.query.keyword, function(result) {
		// no result, render search_nofound page
		if (result.message.length === 0) {
			ProjectService.latestProject(3, function(latest) {
        var project = latest.message;
        project.forEach(function(projectModel){
          if (projectModel.moneyNeeded === -1) {
            projectModel.ratio = -1;
          }
          else {
            projectModel.ratio = (projectModel.moneyRaised / projectModel.moneyNeeded).toFixed(2);
          }
        });
				var ans = {
          curUser: req.user,
					keyword: req.query.keyword,
					total: latest.message.length,
					latest: latest.message
				};
				res.render('project_search_nofound', ans);
			});
		}
		// result found
		else {
        var project = result.message;
        project.forEach(function(projectModel){
          if (projectModel.moneyNeeded === -1) {
            projectModel.ratio = -1;
          }
          else {
            projectModel.ratio = (projectModel.moneyRaised / projectModel.moneyNeeded).toFixed(2);
          }
        });
			var ans = {
        curUser: req.user,
				keyword: req.query.keyword,
				project: project
			};
			res.render('project_search_result', ans);
		}
	});
});

/*
 * get one available project
 */
router.get('/:id', function (req, res) {
	ProjectService.getProjectById(req.params.id, function(result) {
		var project = result.message[0];
		project.owner.detail = result.message[1];

		if (project.moneyNeeded === -1) {
			project.ratio = -1;
		}
		else {
			project.ratio = project.moneyRaised / project.moneyNeeded;
		}

		console.log(project);

		if (result.success) {
			res.render('project_detail', {
				curUser: req.user,
				project: project
			});
		}
	});
});

module.exports = router;
