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

router.get('/home', passport.authenticate('local'), function(req, res) {
	res.render('individual_dashboard');
});

/*
 * PAGE: user PRIVATE profile
 */
router.get('/profile', passport.authenticate('local'), function(req, res) {
	IndividualService.getUser(req.user.username, function (answer) {
		if (answer.success) {
			res.render('individual_profile', {
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
	IndividualService.updateUser(req.user, function(answer) {
		res.send(answer);
	});
});

router.get('/project/join', passport.authenticate('local'), function (req, res) {
	IndividualService.getJoinProjectList(req.user.username, function (result) {
		if (result.success) {
			res.render('individual_join', {
				project: result.message
			});
		}
	});
});
router.get('/project/watch', passport.authenticate('local'), function (req, res) {
	IndividualService.getWatchProjectList(req.user.username, function (result) {
		if (result.success) {
			res.render('individual_watch', {
				project: result.message
			});
		}
	});
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
