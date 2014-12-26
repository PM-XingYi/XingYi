var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects'),
	SuperUserService = require('../service/SuperUserService');

router.get('/home', passport.authenticate('local'), function(req, res) {
	res.sendFile('../views/admin_dashboard.html');
});

/*
 * get all project including unavailable ones
 */
router.get('/examProject', passport.authenticate('local'), function(req, res) {
});

/*
 * examine a project
 */
router.post('/examProject', passport.authenticate('local'), function(req, res) {
});

/*
 * get all comment including unavailable ones
 */
router.get('/examComment', passport.authenticate('local'), function(req, res) {
	SuperUserService.getAllComment(function(ans) {
		res.render('admin_comments_management', ans);
	});
});

/*
 * examine a comment
 */
router.post('/examComment', passport.authenticate('local'), function(req, res) {
});

module.exports = router;
