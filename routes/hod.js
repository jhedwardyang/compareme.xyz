var express = require('express');
var router = express.Router();

var request = require('request');

var entity = require('../hod/entity.js');
var sentiment = require('../hod/sentiment.js');

var callback = function(res, body) {
	console.log(body);
	res.send(body);
}

router.post('/sentiment', function(req, res, next) {
	if (req.body.text === undefined || req.body.text.length == 0) {
		res.send();
		return;
	}
	sentiment(req.body.text, res, callback);
});

router.post('/entity', function(req, res, next) {
	if (req.body.text === undefined || req.body.text.length == 0) {
		res.send();
		return;
	}
	entity(req.body.text, res, callback);
});

module.exports = router;
