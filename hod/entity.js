var request = require('request');
var apikey = process.env.HP_API_KEY;

var entity = function(statement, res, callback) {
	request.post('https://api.havenondemand.com/1/api/sync/extractentities/v1', {form: {apikey: apikey, unique_entities: true, entity_type: ['people_eng', 'places_eng', 'companies_eng', 'organizations', 'films', 'drugs_eng', 'universities'], text: statement}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(res, body);
		} else {
			callback(res, null);
		}
	});
}

module.exports = entity;
