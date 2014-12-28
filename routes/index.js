var express = require('express'),
	router = express.Router(),
	projectService = require('../service/ProjectService');

/* GET home page. */
router.get('/', function(req, res) {
	projectService.latestProject(6, function(ans) {
		if (ans.success) {
			var latest = ans.message;

			latest = [{
				_id: "ididid",
				name: "miaowu",
				moneyRaised: 10,
				moneyNeeded: 100
			}, {
				_id: "dididi",
				name: "buyaoqian",
				moneyNeeded: -1
			}]; // for debug
			
			for (var i = 0; i < latest.length; ++i) {
				if (latest[i].moneyNeeded === -1) {
					latest[i].ratio = -1;
				}
				else {
					latest[i].ratio = latest[i].moneyRaised / latest[i].moneyNeeded;
				}
			}
			res.render('index', {latest: latest});
		}
		else {
			console.log(ans.message);
		}
	});
});

module.exports = router;
