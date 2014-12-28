var express = require('express'),
	router = express.Router(),
	projectService = require('../service/ProjectService');

/* GET home page. */
router.get('/', function(req, res) {
	projectService.latestProject(6, function(ans) {
		if (ans.success) {
			var latest = ans.message;
			latest = []; // for debug
			for (var i = 0; i < latest.length; ++i) {
				latest[i].ratio = latest[i].moneyRaised / latest[i].moneyNeeded;
			}
			console.dir(latest);
			res.render('index', {latest: latest});
		}
		else {
			console.log(ans.message);
		}
	});
});

module.exports = router;
