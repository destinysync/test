'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new TwitterStrategy({
			consumerKey: 'lpxd4Q1HLOMoj7VOT10iLh60p',
			consumerSecret: 'Bk7URgd6mwNPQPFz9zjQZU2pz8WIgA86GHEbHCy3r40xjAmTkE',
			callbackURL: 'http://127.0.0.1:8080/auth/twitter/callback'
		},
		function (token, refreshToken, profile, done) {
			process.nextTick(function () {
				User.findOne({ 'twitter.id': profile.id }, function (err, user) {
					if (err) {
						return done(err);
					}

					if (user) {
						return done(null, user);
					} else {
						var newUser = new User();

						newUser.twitter.id = profile.id;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;
						newUser.twitter.myPins = [];
						newUser.twitter.usedImgID = 0;

						newUser.save(function (err) {
							if (err) {
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			});
		}));
};
