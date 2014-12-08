var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	go = require('../globalObjects');

router.get('/home', passport.authenticate('local'), function(req, res) {
	res.sendFile('');
});

/*
 * get all project of current organization
 */
router.get('/project', passport.authenticate('local'), function(req, res) {
});

/*
 * add a milestone
 */
router.post('/milestone/add', passport.authenticate('local'), function(req, res) {
});

/*
 * add an expenditure
 */
router.post('/expenditure/add', passport.authenticate('local'), function(req, res) {
});

module.exports = router;
