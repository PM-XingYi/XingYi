var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects'),
	SuperUserService = require('../service/SuperUserService'),
	ProjectService = require('../service/ProjectService');

router.get('/home', passport.authenticate('local'), function(req, res) {
	res.render('superuser_dashboard.handlebars');
});

/*
 * get all project including unavailable ones
 */
router.get('/examProject', passport.authenticate('local'), function(req, res) {
	ProjectService.getAllProjectByStatus(2, function (unchecked) {
		ProjectService.getAllProjectByStatus(1, function (passed) {
			ProjectService.getAllProjectByStatus(3, function (failed) {
				if (unchecked.success && passed.success && failed.success) {
					var ans = {
						uncheckedNum: unchecked.message.length,
						uncheckedProject: unchecked.message,
						passedNum: passed.message.length,
						passedProject: passed.message,
						failedNum: failed.message.length,
						failedProject: failed.message
					};
					res.render('superuser_project', ans);
				}
			});
		});
	});
});

/*
 * examine a project
 */
router.post('/examProject', passport.authenticate('local'), function(req, res) {
	SuperUserService.examineProject(req.body.projectID, req.body.approve, req.body.remark, function (result) {
		res.send(result);
	});
});

/*
 * get all comment including unavailable ones
 */
router.get('/examComment', passport.authenticate('local'), function(req, res) {
	ProjectService.getAllCommentByStatus(2, function (unchecked) {
		ProjectService.getAllCommentByStatus(1, function (passed) {
			ProjectService.getAllCommentByStatus(3, function (failed) {
				if (unchecked.success && passed.success && failed.success) {
					var ans = {
						uncheckedNum: unchecked.message.length,
						uncheckedProject: unchecked.message,
						passedNum: passed.message.length,
						passedProject: passed.message,
						failedNum: failed.message.length,
						failedProject: failed.message
					};
					res.render('superuser_comment', ans);
				}
			});
		});
	});
});

/*
 * examine a comment
 */
router.post('/examComment', passport.authenticate('local'), function(req, res) {
	SuperUserService.examineComment(req.body.commentID, req.body.approve, req.body.remark, function (result) {
		res.send(result);
	});
});

module.exports = router;
