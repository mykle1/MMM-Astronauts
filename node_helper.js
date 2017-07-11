/* Magic Mirror
 * Module: MMM-Astronauts
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getJetsons: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).people;
			//	console.log(response.statusCode); // for checking
                this.sendSocketNotification('JETSONS_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_JETSONS') {
            this.getJetsons(payload);
        }
    }
});
