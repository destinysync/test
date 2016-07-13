'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	local: {
		id: String,
		password: String,
		profile: Object,
		books: Object,
		requestsToMe: Object,
		requestsToOthers: Object
	},
	twitter: {
		id: String,
		username: String,
		displayName: String,
		myPins: Object,
		usedImgID: Number
	}
});

module.exports = mongoose.model('User', User);
