var request = require('request');
var apikey = process.env.HP_API_KEY;

var sentiment = function(statement, res, callback, id, date, entityId) {
	request.post('https://api.havenondemand.com/1/api/sync/analyzesentiment/v1', {form: {apikey: apikey, text: statement}}, function (error, response, body) {
		body = JSON.parse(body);
		if (!error && response.statusCode == 200) {
			callback(res, body, id, date, entityId);
		} else {
			callback(res, null, id, date, entityId);
		}
	});
}

module.exports = sentiment;
