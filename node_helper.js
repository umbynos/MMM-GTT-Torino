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
		console.log("-------------------------")
		console.log("notification received")
		console.log("---------------------")
		if (notification === "MMM-GTT-Torino-NOTIFICATION_TEST") {
			console.log("Working notification system. Notification:", notification, "payload: ", payload);
			// Send notification
			this.sendNotificationTest(this.anotherFunction()); //Is possible send objects :)
		}
		if (notification === 'CONFIG') {
			console.log("----------------------------")
			console.log(payload)
			console.log("----------------------------")
			this.sendSocketNotification("Test", 1);
			this.config = payload;
			this.getData();
		}
	},

	// Example function send notification test
	sendNotificationTest: function (payload) {
		this.sendSocketNotification("MMM-GTT-Torino-NOTIFICATION_TEST", payload);
	},

	// this you can create extra routes for your module
	extraRoutes: function () {
		var self = this;
		this.expressApp.get("/MMM-GTT-Torino/extra_route", function (req, res) {
			// call another function
			values = self.anotherFunction();
			res.send(values);
		});
	},

	// Test another function
	anotherFunction: function () {
		return { date: new Date() };
	},

	getData: function () {
		var self = this;
		var urlApi = "https://gpa.madbob.org/query.php?stop=";
		this.config.stops.forEach(function (stop) {
			var req = {
				url: urlApi + stop,
				method: "GET",
			}

			console.log("DEBUG REQUEST")
			console.log(req)

			request(req, function (error, response, body) {
				console.log(response)
				console.log(error)
				if (!error && response.statusCode == 200) {
					self.sendSocketNotification("STOPS", body);
				}
				else {
					self.sendSocketNotification("ERROR", "In TIME request with status code: " + response.statusCode);
				}
			})
		})

		setTimeout(function () { self.getData(); }, this.config.updateInterval);
	}
});
