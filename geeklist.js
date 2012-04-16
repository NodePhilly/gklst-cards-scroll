var fs          = require('fs')
  , async       = require('async')
  , request     = require('request')
  , im          = require('imagemagick')
  , OAuth       = require('oauth').OAuth
  , credentials = require('./gklst-creds.json');

exports.init = function(callback) {

	var alldata = {
		users: {
		  'timsavery': undefined,
		  'csanz': undefined,
		  'rekatz': undefined,
		},
		cards: []
	};

	var oa = new OAuth(
	  "http://sandbox-api.geekli.st/v1/oauth/request_token",
	  "http://sandbox-api.geekli.st/v1/oauth/access_token",
	  credentials.CONSUMER_KEY,
	  credentials.CONSUMER_SECRET,
	  "1.0",
	  null,
	  "HMAC-SHA1"
	);

	async.series([

	  function(seriesCallback) {
	  	async.map(Object.keys(alldata.users), function(user, callback) {
		  oa.getProtectedResource('http://sandbox-api.geekli.st/v1/users/' + user, 'GET', credentials.ACCESS_TOKEN, credentials.ACCESS_TOKEN_SECRET,  function (error, data, response) {
		    if (error) callback(error, null);
		      
	        alldata.users[user] = JSON.parse(data);

	        request.get(alldata.users[user].data.avatar.large, function(err, response, body) {
	          fs.readFile('public/img/geeks/' + user + '-large.jpg', 'binary', function(err, data) {
	            im.resize({
	              srcPath: 'public/img/geeks/' + user + '-large.jpg',
	              dstPath: 'public/img/geeks/' + user + '.jpg',
	              width: 300
	            }, function() {
	              callback();
	            });
	          });
	        }).pipe(fs.createWriteStream('public/img/geeks/' + user + '-large.jpg'));
		  });
		}, seriesCallback);
	  },

	  function(seriesCallback) {
	    async.map(Object.keys(alldata.users), function(user, callback) {
		    oa.getProtectedResource('http://sandbox-api.geekli.st/v1/users/' + user + '/cards', 'GET', credentials.ACCESS_TOKEN, credentials.ACCESS_TOKEN_SECRET,  function (error, data, response) {
		      var cardsResult = JSON.parse(data);

		      for (var cardIdx=0; cardIdx<cardsResult.data.cards.length; cardIdx++) {
		        alldata.cards.push({
		      	  headline: cardsResult.data.cards[cardIdx].headline,
		          user: {
	                name: user,
	                avatar: '/img/geeks/' + user + '.jpg'
	              }
		        });
		      }

		      callback();
		    });
		  }, seriesCallback);
	  }

	], function() {
		
	  callback(alldata);

	});
};