var express = require('express');
var router = express.Router();

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
	res.send("waiting...");
});

router.get('/:id', function(req, res, next) {
	connection.query('SELECT * FROM results WHERE queryId = ' + req.params.id, function(err, results, fields) {
		res.send(results);
	});
});

router.get('/:id/counts', function(req, res, next) {
	connection.query('SELECT COUNT(*) FROM entities WHERE queryId = ' + req.params.id, function(err, results, fields) {
		res.send(results);
	});
});

router.get('/:id/names', function(req, res, next) {
	connection.query('SELECT id, text FROM entities WHERE queryId = ' + req.params.id, function(err, results, fields) {
		res.send(results);
	});
});

module.exports = router;

