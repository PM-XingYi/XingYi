var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('./database/User'),
	Project = require('./database/Project');

router.param('id', /^\d+$/);

/*
 * get all available project
 */
router.get('/all', function (req, res) {
});

/*
 * get one available project
 */
router.get('/:id', function (req, res) {
});

/*
 * get latest n available project
 */
router.get('/latest', function (req, res) {
});

/*
 * get available comments of a available project
 */
router.get('/:id/comment', function (req, res) {
});

/*
 * get all joined individual of a project
 */
router.get('/:id/joinedIndividual', passport.authenticate('local'), function(req, res) {
});

/*
 * get all donation of a project
 */
router.get('/:id/donation', passport.authenticate('local'), function(req, res) {
});

/*
 * publish a project
 */
router.post('/publish', passport.authenticate('local'), function(req, res) {
});

module.exports = router;
