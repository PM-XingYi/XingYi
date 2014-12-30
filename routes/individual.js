var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	IndividualService = require('../service/IndividualService'),
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

router.get('/home', function(req, res) {
	if (req.user) {
		res.render('individual_dashboard', {curUser: req.user});
	}
});

/*
 * PAGE: user PRIVATE profile
 */
router.get('/profile', function(req, res) {
	if (req.user) {
		IndividualService.getUser(req.user.username, function (answer) {
			if (answer.success) {
				res.render('individual_profile', {
					user: answer.message
				});
			}
		});
	}
});
/*
 * modify user profile
 * req.body.key is in []
 */
router.post('/profile/edit', function (req, res) {
	if (req.user) {
		IndividualService.updateUser(req.body, function(answer) {
			res.send(answer);
		});
	}
});

router.get('/project/join', function (req, res) {
	if (req.user) {
		IndividualService.getJoinProjectList(req.user.username, function (result) {
			if (result.success) {
				res.render('individual_join', {
					curUser: req.user,
					project: result.message
				});
			}
		});
	}
});
router.get('/project/watch', function (req, res) {
	if (req.user) {
		IndividualService.getWatchProjectList(req.user.username, function (result) {
			if (result.success) {
				res.render('individual_watch', {
					project: result.message
				});
			}
		});
	}
});

/*
 * get donation page
 */
router.get('/donate/:id', passport.authenticate('local'), function(req, res) {
	ProjectService.getProjectById(req.body.project, function (result) {
		if (result.success) {
			res.render('individual_donate', result.message);
		}
	});
});


/*
 * join a project
 */
router.post('/project/join/:id', passport.authenticate('local'), function(req, res) {
	IndividualService.joinProject(req.user.username, req.params.id, function(answer) {
		res.send(answer);
	});
});
/*
 * unjoin a project
 */
router.post('/project/unjoin/:id', passport.authenticate('local'), function(req, res) {
	IndividualService.cancelJoinProject(req.user.username, req.params.id, function(answer) {
		res.send(answer);
	});
});
/*
 * watch a project
 */
router.post('/project/watch/:id', passport.authenticate('local'), function(req, res) {
	IndividualService.watchProject(req.user.username, req.params.id, function(answer) {
		res.send(answer);
	});
});
/*
 * unwatch a project
 */
router.post('/project/unwatch/:id', passport.authenticate('local'), function(req, res) {
	IndividualService.cancelWatchProject(req.user.username, req.params.id, function(answer) {
		res.send(answer);
	});
});

/*
 * add a comment to a project
 */
router.post('/comment', passport.authenticate('local'), function(req, res) {
	IndividualService.commentProject(req.user.username, req.body, function (result) {
		res.send(result);
	});
});
/*
 * donate to a project
 */
router.post('/donate', passport.authenticate('local'), function(req, res) {
	IndividualService.donateProject(req.user.username, req.body, function (result) {
		res.send(result);
	});
});

module.exports = router;
