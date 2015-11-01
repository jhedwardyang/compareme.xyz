var request = require('request');

var stock = function(ticker, queryId, entityId, callback) {
	var url = "http://ichart.yahoo.com/table.csv?s=" + ticker + "&a=9&b=24&c=2015&d=10&e=2&f=2015&g=d&ignore=.csv";
	request.get(url, function (error, response, body) {
		if (error || response.statusCode != 200) {
			callback(null);
		} else {
			var dates = [];
			var close = [];
			var lines = body.split("\n");
			for (var i = 1; i < lines.length; ++i) {
				var blocks = lines[i].split(",");
				if (blocks.length == 1) continue;
				dates.push(blocks[0]);
				close.push(blocks[4]);
			}
			callback({dates: dates.reverse(), close: close.reverse()}, queryId, entityId);
		}
	});
}

module.exports = stock;
