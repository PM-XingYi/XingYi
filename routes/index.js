var express = require('express'),
	router = express.Router(),
	projectService = require('../service/ProjectService');

/* GET home page. */
router.get('/', function(req, res) {
	projectService.latestProject(8, function(ans) {
		if (ans.success) {
			var latest = ans.message;
			console.log(latest);
			for (var i = 0; i < latest.length; ++i) {
				if (latest[i].moneyNeeded === -1) {
					latest[i].ratio = -1;
				}
				else {
					latest[i].ratio = latest[i].moneyRaised / latest[i].moneyNeeded;
				}
			}
			res.render('index', {
				curUser: req.user,
				latest: latest
			});
		}
		else {
			console.log(ans.message);
		}
	});
});

module.exports = router;
