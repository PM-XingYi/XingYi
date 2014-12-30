var express = require('express'),
	router = express.Router(),
	go = require('../globalObjects'),
	IndividualService = require('../service/IndividualService'),
	OrganizationService = require('../service/OrganizationService');

/*
 * register an individual user
 */
router.post('/individual', function (req, res) {
	console.log(IndividualService.register);
	IndividualService.register(req.body.username,
								req.body.password,
								req.body.email,
								req.body.mobile, function(result){
		// console.log(result);
		res.send(result);
	});
});

/*
 * register an organization user
 */
router.post('/organization', function (req, res) {
	OrganizationService.register(req.body.username,
								req.body.password,
								req.body.email,
								req.body.phone,
								req.body.orgName,
								req.body.orgNum, function(result) {
		res.send(result);
	});
});

module.exports = router;
