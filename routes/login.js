var express = require('express'),
	router = express.Router(),
	passport = require('passport');

router.post('/individual', passport.authenticate('local', {
	successRedirect: '/individual/home',
	failureRedirect: '/login.html',
	failureFlash: true
}));

router.post('/organization', passport.authenticate('local', {
	successRedirect: '/organization/home',
	failureRedirect: '/login.html',
	failureFlash: true
}));

router.post('/superuser', passport.authenticate('local', {
	successRedirect: '/superuser/home',
	failureRedirect: '/login.html',
	failureFlash: true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login.html');
});

module.exports = router;
