var stock = require('../yahoo/stock.js');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'thisorthat'
});
connection.connect();

var action = {};

var call = function(obj, queryId, entityId) {
	if (obj != null) {
		console.log(obj);
		for (var i = 0; i < obj.dates.length; ++i) {
			var date = obj.dates[i];
			var price = obj.close[i];
			connection.query('INSERT INTO stocks VALUES (null, ' + queryId + ', ' + entityId + ',"' + date + '",' + price + ')', function(err, result) {
				if (err) throw err;
			});
		}
	}
	
}
var NASDAQ = function(ticker, queryId, entityId) {
	stock(ticker, queryId, entityId, call);
}
var NYSE = function(ticker, queryId, entityId) {
	stock(ticker, queryId, entityId, call);
}
var LON = function(ticker, queryId, entityId) {
	stock(ticker, queryId, entityId, call);
}


action.NASDAQ = NASDAQ;
action.NYSE = NYSE;
action.LON = LON;

module.exports = action;