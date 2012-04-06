/*
var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// View Routes
app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
*/

var creds = require('./gklst-creds.json');

var util= require('util')
  , async = require('async')
  , OAuth = require('oauth').OAuth;

var oa = new OAuth(
	"http://sandbox-api.geekli.st/v1/oauth/request_token",
  "http://sandbox-api.geekli.st/v1/oauth/access_token",
  creds.CONSUMER_KEY,
  creds.CONSUMER_SECRET,
  "1.0",
  null,
  "HMAC-SHA1"
);

var users = {
  'timsavery': undefined,
  'csanz': undefined,
  'rekatz': undefined,
  'paul_irish': undefined, 
  'tendrelove': undefined,
  'matz': undefined
};

var cards = [];

async.series([

  function(seriesCallback) {
  	async.map(Object.keys(users), function(user, callback) {
	  oa.getProtectedResource('http://sandbox-api.geekli.st/v1/users/' + user, 'GET', creds.ACCESS_TOKEN, creds.ACCESS_TOKEN_SECRET,  function (error, data, response) {
	    if (error) callback(error, null);
	      users[user] = JSON.parse(data);
          callback();
		});
	}, seriesCallback);
  },

  function(seriesCallback) {
    async.map(Object.keys(users), function(user, callback) {
	  oa.getProtectedResource('http://sandbox-api.geekli.st/v1/users/' + user + '/cards', 'GET', creds.ACCESS_TOKEN, creds.ACCESS_TOKEN_SECRET,  function (error, data, response) {
	    var cardsResult = JSON.parse(data);

	    for (var cardIdx=0; cardIdx<cardsResult.data.cards.length; cardIdx++) {
	      cards.push({
	      	headline: cardsResult.data.cards[cardIdx].headline,
	        user: user
	      });
	    }

	    callback();
	  });
	}, seriesCallback);
  }

], function() {
	console.log(cards);
});