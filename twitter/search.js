var request = require('request');

var search = function(searchtext, res, callback) {
	var headers = {
		url: "https://api.twitter.com/1.1/search/tweets.json?include_entities=false&lang=en&q=" + searchtext,
		headers: {
	    	"Authorization": "Bearer " + process.env.TWITTER_BEARER_TOKEN
	  	}
	};
	request.get(headers, function(error, response, body) {
		callback(res, body);
	});
}

module.exports = search;
