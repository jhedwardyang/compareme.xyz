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


router.get('/:id', function(req, res, next) {
	connection.query('SELECT entityId, date, value FROM stocks WHERE queryId = ' + req.params.id + " ORDER BY date ASC", function(err, results, fields) {
		res.send(results);
	});
});

module.exports = router;
