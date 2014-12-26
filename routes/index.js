var express = require('express'),
	router = express.Router(),
	projectService = require('../service/ProjectService');

/* GET home page. */
router.get('/', function(req, res) {
	projectService.latestProject(6, function(latest) {
		for (var i = 0; i < latest.length; ++i) {
			latest[i].ratio = latest[i].moneyRaised / latest[i].moneyNeeded;
		}
		res.render('index', {latest: latest});
	});
});

module.exports = router;
