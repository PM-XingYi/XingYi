var express = require('express'),
	router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/index.html');
});

module.exports = router;
