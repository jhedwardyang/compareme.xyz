$(function(){
	var id = getUrlParameter('id');
	if (id !== true) {
		$.get("/waiting/" + id + "/counts", function( data ) {
			if (data[0] !== undefined && data[0]["COUNT(*)"] !== undefined) {
				var count = Number(data[0]["COUNT(*)"]);
				var running;
				running = setInterval(function() {
					$.get("/waiting/" + id, function( data1 ) {
						if (data1.length == count * 7) {
							clearInterval(running);
							$("#waiting").hide();
							$("#show").show();
							update_charts(data1);
						}
					});
				}, 2000);
			}
	    });
	} else {
		console.log(id);
	}
});



var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var _data;
var update_charts = function (_data) {
	var id = getUrlParameter('id');
	if (id !== true) {
		this._data = _data;
		$.get("/waiting/" + id + "/names").done(function( data11 ) {
			var entityMap = {};
			for (var i = 0; i < data11.length; ++i) {
				var entityId = data11[i].id;
				var entityText = data11[i].text;
				entityMap[entityId] = entityText;
			}

			var dates = {};
			var entities = {};

			var map = {};
			for (var i = 0; i < _data.length; ++i) {
				_data[i].date = _data[i].date.substring(0, 10);
				if (map[_data[i].entityId] === undefined) {
					map[_data[i].entityId] = {};
				}
				if (entities[_data[i].entityId] === undefined) {
					entities[_data[i].entityId] = 1;
				}
				if (dates[_data[i].date] === undefined) {
					dates[_data[i].date] = 1;
				}
				map[_data[i].entityId][_data[i].date] = {
					positive: _data[i].positive,
					negative: _data[i].negative,
					aggregate: _data[i].aggregate
				};
			}

			var keys = Object.keys(dates);
			keys.sort();


			var lineChartData = {};
			var labels = keys;
			lineChartData.labels = labels;
			// for (var i = 0; i < lineChartData.labels.length; ++i) {
			// 	lineChartData.labels[i] = lineChartData.labels[i].substring(0, 10);
			// }
			lineChartData.datasets = [];

			lineChartData.datasets.push(
				{
						label: "base line",
						fillColor : "rgba(0,0,0,0.35)",
						strokeColor : "rgba(0,0,0,1)",
						pointColor : "rgba(0,0,0,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(0,0,0,1)",
						data: [0,0,0,0,0,0,0]
					}
				);
			var entities_keys = Object.keys(entities);
			for (var j = 0; j < entities_keys.length; ++j) {
				var data = [];
				for (var i = 0; i < labels.length; ++i) {
					data.push(map[entities_keys[j]][labels[i]].aggregate);
				}
				if (j % 3 == 0) {
					lineChartData.datasets.push({
						label: entityMap[entities_keys[j]],
						fillColor : "rgba(45,142,176,0.35)",
						strokeColor : "rgba(45,142,176,1)",
						pointColor : "rgba(45,142,176,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(45,142,176,1)",
						data: data
					});
				} else if (j%3 == 1) {
					lineChartData.datasets.push({
						label: entityMap[entities_keys[j]],
						fillColor : "rgba(244,108,111,0.35)",
						strokeColor : "rgba(244,108,111,1)",
						pointColor : "rgba(244,108,111,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(244,108,111,1)",
						data: data
					});
				} else {
					lineChartData.datasets.push({
						label: entityMap[entities_keys[j]],
						fillColor : "rgba(60,120,60,0.35)",
						strokeColor : "rgba(60,120,60,1)",
						pointColor : "rgba(60,120,60,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(60,120,60,1)",
						data: data
					});
				}
			}

			for (var j = 0; j < entities_keys.length; ++j) {
				// entityId = entities_keys[j]
				var zx_data;
				var positive = 0; var negative = 0;
				for (var i = 0; i < _data.length; ++i) {
					if (_data[i].entityId == entities_keys[j]) {
						positive += _data[i].positive;
						negative += _data[i].negative;
					}
				}
				zx_data = [{
					value: positive,
					color: "rgba(42,142,176,1)",
					highlight: "rgba(42,142,176,0.35)",
					label: "Positive"
				},
				{
					value: negative,
					color: "rgba(244,108,111,1)",
					highlight: "rgba(244,108,111,0.35)",
					label: "Negative"
				}];
				var idddd = "doughnut" + j;
				$("#title" + j).html(entityMap[entities_keys[j]]);
				var ctx = document.getElementById(idddd).getContext("2d");
				new Chart(ctx).Doughnut(zx_data	, {
					responsive: false
				});

			}

			for (var j = 5; j >= entities_keys.length; --j) {
				$("#doughnut" + j).parent("div").remove();
				// $("#title" + j).remove();
			}

			var ctx0 = document.getElementById("chartline").getContext("2d");
			window.myLine = new Chart(ctx0).Line(lineChartData, {
				responsive: false,
				scaleFontColor: "#fff",
				scaleGridLineColor: "rgba(120,120,120,0.5)",
				multiTooltipTemplate: "<%= datasetLabel %>: <%= value %>"
			});
		});
	}
}
