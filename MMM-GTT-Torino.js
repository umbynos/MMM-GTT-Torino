/* global Module */

/* Magic Mirror
 * Module: MMM-GTT-Torino
 *
 * By Umberto Baldi
 * MIT Licensed.
 */

Module.register("MMM-GTT-Torino", {
	defaults: {
		updateInterval: 60000, // every minute
		retryDelay: 5000,
		stops: [40, 597, 644],
		lines: [9, 33, "59/"],
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function () {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		this.sendSocketNotification('CONFIG', this.config);
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function (delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad;
		var self = this;
		setTimeout(function () {
			self.getData();
		}, nextLoad);
	},

	getDom: function () {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {
			var wrapperDataRequest = document.createElement("div");
			// check format https://jsonplaceholder.typicode.com/posts/1
			wrapperDataRequest.innerHTML = this.dataRequest.title;

			var labelDataRequest = document.createElement("label");
			// Use translate function
			//             this id defined in translations files
			labelDataRequest.innerHTML = this.translate("TITLE");


			wrapper.appendChild(labelDataRequest);
			wrapper.appendChild(wrapperDataRequest);
		}

		// Data from helper
		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML = this.translate("UPDATE") + ": " + this.dataNotification;

			wrapper.appendChild(wrapperDataNotification);
		}
		return wrapper;
	},

	getScripts: function () {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-GTT-Torino.css",
		];
	},

	// Load translations files
	getTranslations: function () {
		return {
			en: "translations/en.json",
			it: "translations/it.json"
		};
	},

	processData: function (data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed); }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("MMM-GTT-Torino-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if (notification === "STOPS") {
			console.log(payload)
			console.log("--------------------")
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom(1000);
		}
	},
});
