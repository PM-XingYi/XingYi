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
	if (req.user) {
		res.render('individual_dashboard', {curUser: req.user});
	} else {
    res.redirect("/superuserLogin.html");
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
		IndividualService.updateUser(req.user.username, req.body, function(answer) {
			res.send(answer);
		});
	}
});

router.get('/project/join', function (req, res) {
	if (req.user) {
		IndividualService.getJoinProjectList(req.user.username, function (result) {
			if (result.success) {

        result.message.forEach(function(projectModel){
          if (projectModel.moneyNeeded === -1) {
            projectModel.ratio = -1;
          }
          else {
            projectModel.ratio = (projectModel.moneyRaised / projectModel.moneyNeeded).toFixed(2);
          }
        });

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
	if (req.user) {
		ProjectService.getProjectById(req.params.id, function (result) {
			if (result.success) {
				console.log(result.message);
				res.render('individual_donate', {
					curUser: req.user,
					project: result.message[0]
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
	if (!req.user) {
    res.send(403);
    return;
  }
	IndividualService.joinProject(req.user.username, req.params.id.input ||req.params.id, function(answer) {
		res.send(answer);
	});
});
/*
 * unjoin a project
 */
router.post('/project/unjoin/:id', function(req, res) {
	if (!req.user) {
    res.send(403);
    return;
  }
	IndividualService.cancelJoinProject(req.user.username, req.params.id.input ||req.params.id, function(answer) {
		res.send(answer);
	});
});
/*
 * watch a project
 */
router.post('/project/watch/:id', function(req, res) {
	if (!req.user) {
    res.send(403);
    return;
  }
	IndividualService.watchProject(req.user.username, req.params.id.input ||req.params.id, function(answer) {
		res.send(answer);
	});
});
/*
 * unwatch a project
 */
router.post('/project/unwatch/:id', function(req, res) {
	if (!req.user) {
    res.send(403);
    return;
  }
	IndividualService.cancelWatchProject(req.user.username, req.params.id.input ||req.params.id, function(answer) {
		res.send(answer);
	});
});

/*
 * add a comment to a project
 */
router.post('/comment', function(req, res) {
	if (!req.user) {
    res.send(403);
    return;
  }
	IndividualService.commentProject(req.user.username, req.body, function (result) {
		res.send(result);
	});
});
/*
 * donate to a project
 */
router.post('/donate', function(req, res) {
	if (req.user) {
		IndividualService.donateProject(req.user.username, req.body, function (result) {
			console.log(result);
			res.send(result);
		});
	}
	
});

module.exports = router;
