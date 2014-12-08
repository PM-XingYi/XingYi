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
	res.sendFile('');
});

/*
 * get user PRIVATE profile
 */
router.get('/profile', passport.authenticate('local'), function(req, res) {
	IndividualService.getUser(req.user.username, function (answer) {
		res.send(answer);
	});
});


/*
 * modify user profile
 * req.body.key is in []
 */
var keySet = ['mobile'];
router.post('/profile/edit', passport.authenticate('local'), function (req, res) {
	go.database.User.findOne({username: req.user.username}, function (err, user) {
		if (user.userType !== 'individual') {
			res.send({
				success: false,
				message: "not an individual user"
			});
		}
		go.database.Individual.findById(user.detail, function (err, individual) {
			if (err) {
				res.send({
					success: false,
					message: "internal error"
				});
			}
			for (var i = 0; i < keySet.length; ++i) {
				if (keySet[i] === req.body.key) {
					individual[keySet[i]] = req.body.value;
					individual.save(function (err) {
						if (err) {
							res.send({
								success: false,
								message: "update fail"
							});
						}
						res.send({
							success: true,
							message: "success"
						});
					});
					return;
				}
			}
			res.send({
				success: false,
				message: "illegal key"
			});
		});
	});
});

/*
 * join a project
 */
router.post('/project/join/:id', passport.authenticate('local'), function(req, res) {
});

/*
 * unjoin a project
 */
router.post('/project/unjoin/:id', passport.authenticate('local'), function(req, res) {
});

/*
 * watch a project
 */
router.post('/project/watch/:id', passport.authenticate('local'), function(req, res) {
});

/*
 * unwatch a project
 */
router.post('/project/unwatch/:id', passport.authenticate('local'), function(req, res) {
});

/*
 * add a comment to a project
 */
router.post('/comment', passport.authenticate('local'), function(req, res) {
});

/*
 * get all donation of current user
 */
router.get('/donate/all', passport.authenticate('local'), function(req, res) {
});

/*
 * donate to a project
 */
router.post('/donate', passport.authenticate('local'), function(req, res) {
});

module.exports = router;
