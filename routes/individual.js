var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	IndividualService = require('../service/IndividualService');

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
	res.render('dashboard_individual');
});

/*
 * PAGE: user PRIVATE profile
 */
router.get('/profile', passport.authenticate('local'), function(req, res) {
	IndividualService.getUser(req.user.username, function (answer) {
		if (answer.success) {
			res.render('profile_edit', answer);
		}
		else {
			res.status(500).end();
		}
	});
});
/*
 * get all donation of current user
 */
router.get('/donate/all', passport.authenticate('local'), function(req, res) {
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
});
/*
 * donate to a project
 */
router.post('/donate', passport.authenticate('local'), function(req, res) {
});

module.exports = router;
