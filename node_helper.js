/* Magic Mirror
 * Node Helper: MMM-GTT-Torino
 *
 * By Umberto Baldi
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the notification.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function (notification, payload) {
		console.log("Working notification system. Notification:", notification, "payload: ", payload)
		if (notification === 'CONFIG') {
			this.config = payload;
			this.getData();
		}
	},
	requiresVersion: "2.1.0",

	// this you can create extra routes for your module
	extraRoutes: function () {
		var self = this;
		this.expressApp.get("/MMM-GTT-Torino/extra_route", function (req, res) {
			// call another function
			values = self.anotherFunction();
			res.send(values);
		});
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function () {
		var self = this;
		var urlApi = "https://gpa.madbob.org/query.php?stop=";
		var result = [];
		var bodyFiltered = [];
		var lines = this.config.lines;
		this.config.stops.forEach(function (stop) {
			var req = {
				url: urlApi + stop,
				method: "GET",
			}

			request(req, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					// console.log(body);
					const body1 = JSON.parse(body);
					bodyFiltered = body1.filter(function(item) {
						console.log(lines);
						console.log(item.line);
						console.log(lines.includes(item.line)); //false??
						return lines.includes(item.line);
					})
					//  => lines.includes(item.line)); // TODO does not work
					console.log(body1); // [{ line: '16', hour: '', realtime: 'true' },{ line: '16', hour: '', realtime: 'true' }]
					console.log(typeof(body1[0])); // object
					console.log(bodyFiltered); // [] empty dunno why
					result.push({'stop' : stop, 'timetable' : bodyFiltered});
				}
				else {
					console.error(error)
					self.sendSocketNotification("ERROR", "In TIME request with status code: " + response.statusCode);
				}
			})
		})
		self.sendSocketNotification("STOPS", result);
		setTimeout(function () { self.getData(); }, this.config.updateInterval);
	}
});
