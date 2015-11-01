var request = require('request');
var apikey = process.env.HP_API_KEY;

var sentiment = function(statement, res, callback) {
	request.post('https://api.havenondemand.com/1/api/sync/analyzesentiment/v1', {form: {apikey: apikey, text: statement}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(res, body);
		} else {
			callback(res, null);
		}
	});
}

module.exports = sentiment;
