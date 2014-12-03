var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('./database/User'),
	Individual = require('./database/Individual');

/*
 * modify user profile
 * req.body.key is in []
 */
var keySet = ['mobile'];
router.post('/profile/edit', passport.authenticate('local'), function(req, res) {
	User.findOne({username: req.user.username}, function (err, user) {
		if (user.userType !== 'individual') {
			res.send({
				success: false,
				message: "not an individual user"
			})
		}
		Individual.findById(user.detail, function (err, individual) {

		})
	}
});

module.exports = router;
