var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects');

router.get('/home', passport.authenticate('local'), function(req, res) {
	res.sendFile('');
});

/*
 * get all project including unavailable ones
 */
router.get('/allProject', passport.authenticate('local'), function(req, res) {
});

/*
 * get all comment including unavailable ones
 */
router.get('/allComment', passport.authenticate('local'), function(req, res) {
});

/*
 * examine a project
 */
router.post('/examProject', passport.authenticate('local'), function(req, res) {
});

/*
 * examine a comment
 */
router.post('/examComment', passport.authenticate('local'), function(req, res) {
});

module.exports = router;
