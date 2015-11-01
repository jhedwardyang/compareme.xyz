var request = require('request');

var search = function(searchtext, date, res, callback, id, entityId) {
	var qs = {
		until: date,
		include_entities: false,
		lang: "en",
		count: 100,
		result_type: "recent",
		q: searchtext
	};
	var headers = {
		url: "https://api.twitter.com/1.1/search/tweets.json",
		qs: qs,
		headers: {
	    	"Authorization": "Bearer " + process.env.TWITTER_BEARER_TOKEN
	  	}
	};
	request.get(headers, function(error, response, body) {
		body = JSON.parse(body);
		if (callback != null) {
			callback(res, body, id, date, entityId);
		}
	});
}

module.exports = search;
