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
router.param('id', /^\w+$/);

router.get('/home', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
		res.render('individual_dashboard', {curUser: req.user});
	} else {
	res.redirect("/superuserLogin.html");
  }
});

/*
 * PAGE: user PRIVATE profile
 */
router.get('/profile', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
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
	if (req.user && req.user.userType == 'individual') {
		IndividualService.updateUser(req.user.username, req.body, function(answer) {
			res.send(answer);
		});
	}
});

router.get('/project/join', function (req, res) {
	if (req.user && req.user.userType == 'individual') {
		IndividualService.getJoinApplicationList(req.user.username, function (result) {
			if (result.success) {

		result.message.forEach(function(application){
		  if (application.project.moneyNeeded === -1) {
			application.project.ratio = -1;
		  }
		  else {
			application.project.ratio = (application.project.moneyRaised / application.project.moneyNeeded).toFixed(2);
		  }
		});

				res.render('individual_join', {
					curUser: req.user,
		  application: result.message
				});
			}
		});
	}
});
router.get('/project/watch', function (req, res) {
	if (req.user && req.user.userType == 'individual') {
		IndividualService.getWatchProjectList(req.user.username, function (result) {
			if (result.success) {

		result.message.forEach(function(projectModel){
		  if (projectModel.moneyNeeded === -1) {
			projectModel.ratio = -1;
		  }
		  else {
			projectModel.ratio = (projectModel.moneyRaised / projectModel.moneyNeeded).toFixed(2);
		  }
		});

				res.render('individual_watch', {
		  user: req.user,
					project: result.message
				});
			}
		});
	}
});

/*
 * get donation page
 */
router.get('/donate/:id', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
		ProjectService.getProjectById(req.params.id, function (result) {
			if (result.success) {
				res.render('individual_donate', {
					curUser: req.user,
					project: result.message
				});
			}
		});
	}
	else {
		res.send({
			success: false,
			message: "not login yet"
		});
	}
});


/*
 * join a project
 */
router.post('/project/join/:id', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
		IndividualService.joinProject(req.user.username, req.params.id.input ||req.params.id, req.body.reason, function(answer) {
			res.send(answer);
		});
	}
	else {
		res.send(403);
		return;
	}
});
/*
 * unjoin a project
 */
router.post('/project/unjoin/:id', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
		IndividualService.cancelJoinProject(req.user.username, req.params.id.input ||req.params.id, function(answer) {
			res.send(answer);
		});
	}
	else {
		res.send(403);
		return;
	}
});
/*
 * watch a project
 */
router.post('/project/watch/:id', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
		IndividualService.watchProject(req.user.username, req.params.id.input ||req.params.id, function(answer) {
			res.send(answer);
		});
	}
	else {
		res.send(403);
		return;
	}
});
/*
 * unwatch a project
 */
router.post('/project/unwatch/:id', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
		IndividualService.cancelWatchProject(req.user.username, req.params.id.input ||req.params.id, function(answer) {
			res.send(answer);
		});
	}
	else {
		res.send(403);
		return;
	}
});

/*
 * add a comment to a project
 */
router.post('/comment', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
		IndividualService.commentProject(req.user.username, req.body, function (result) {
			res.send(result);
		});
	}
	else {
		res.send(403);
		return;
	}
});
/*
 * donate to a project
 */
router.post('/donate', function(req, res) {
	if (req.user && req.user.userType == 'individual') {
		IndividualService.donateProject(req.user.username, req.body, function (result) {
			console.log(result);
			res.send(result);
		});
	}
	else {
		res.send(403);
		return;
	}
});

module.exports = router;
