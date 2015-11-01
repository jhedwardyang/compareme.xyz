var express = require('express');
var router = express.Router();

var entity = require('../hod/entity.js');
var twitter = require('../twitter/search.js');
var sentiment = require('../hod/sentiment.js');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'thisorthat'
});
connection.connect();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.query.q === undefined || req.query.q == 0) {
		res.send("No query found");
		return;
	}
	var q = req.query.q;

	//
	connection.query('INSERT INTO queries VALUES (null, ' + connection.escape(q) + ', NULL)', function(err, result) {
		if (err) throw err;
		var id;
		connection.query('SELECT * FROM queries WHERE text = ' + connection.escape(q) + ' ORDER BY id DESC LIMIT 1', function(err, results, fields) {
			if (err) throw err;
			id = results[0].id;
			entity(q, res, p1, id);
		});
	});
});

var p1 = function(res, body, id) {
	if (body === null || body.entities === undefined) {
		res.send("No entity found");
		return;
	}
	var dates = ["2015-10-25","2015-10-26","2015-10-27","2015-10-28","2015-10-29","2015-10-30","2015-10-31"];
	for (var i = 0; i < body.entities.length; ++i) {
		(function(i) {
			var clean = connection.escape(body.entities[i].matches[0].original_text)
			connection.query('INSERT INTO entities VALUES (null, ' + id + ', ' + clean + ')', function(err, result) {
			if (err) throw err;
				connection.query('SELECT id FROM entities WHERE queryId = ' + id + ' AND text = ' + clean + ' ORDER BY id DESC LIMIT 1', function(err, results, fields) {
					if (err) throw err;
					var entityId = results[0].id;
					for (var j = 0; j < dates.length; ++j) {
						twitter(clean, dates[j], res, p2, id, entityId);
					}
				});
			});
		})(i);
	}
	// sentiment
	res.redirect("/waiting.html?id=" + id);
}

var p2 = function(res, body, id, date, entityId) {
	var statuses = body.statuses;
	var short = {};
	var compressed = "";
	for (var i = 0; i < statuses.length; ++i) {
		if (short[statuses[i].text] === undefined) {
			short[statuses[i].text] = 1;
			compressed += "[cmp]" + statuses[i].text;
		}
	}
	sentiment(compressed, res, p3, id, date, entityId);
}
var p3 = function(res, body, id, date, entityId) {
	connection.query('INSERT INTO results VALUES (null, ' + id + ',' + entityId + ',"' + date + '",' + body.positive.length + ',' + body.negative.length + ',' + body.aggregate.score + ')', function(err, result) {
		if (err) throw err;
	});
}

module.exports = router;
