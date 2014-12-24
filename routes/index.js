var express = require('express'),
	router = express.Router(),
	projectServive = require('../service/ProjectServive');

/* GET home page. */
router.get('/', function(req, res) {
	projectServive.latestProject(6, function(latest) {
		for (var i = 0; i < latest.length; ++i) {
			latest[i].ratio = latest[i].moneyRaised / latest[i].moneyNeeded;
		}
		res.render('index', {latest: latest});
	});
});

module.exports = router;
