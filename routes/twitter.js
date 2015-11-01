var express = require('express');
var router = express.Router();

var search = require('../twitter/search.js');

var callback = function(res, body) {
	console.log(body);
	res.send(body);
}

router.post('/twitter', function(req, res, next) {
	if (req.body.text === undefined || req.body.text.length == 0) {
		res.send();
		return;
	}
	search(req.body.text, res, callback);
})

module.exports = router;
