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
		this.config.stops.forEach(function (stop) {
			var req = {
				url: urlApi + stop,
				method: "GET",
			}

			request(req, function (error, response, body) {
				console.log(body)
				if (!error && response.statusCode == 200) {
					self.sendSocketNotification("STOPS", body);
				}
				else {
					console.error(error)
					self.sendSocketNotification("ERROR", "In TIME request with status code: " + response.statusCode);
				}
			})
		})

		setTimeout(function () { self.getData(); }, this.config.updateInterval);
	}
});
