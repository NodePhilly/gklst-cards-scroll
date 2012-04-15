var creds = require('./gklst-creds.json');

var fs = require('fs')
  , util= require('util')
  , async = require('async')
  , im = require('imagemagick')
  , request = require('request')
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

users = {
  'timsavery': undefined,
  'csanz': undefined,
  'rekatz': undefined
};

cards = [];

async.series([

  function(seriesCallback) {
  	async.map(Object.keys(users), function(user, callback) {
	    oa.getProtectedResource('http://sandbox-api.geekli.st/v1/users/' + user, 'GET', creds.ACCESS_TOKEN, creds.ACCESS_TOKEN_SECRET,  function (error, data, response) {
	      if (error) callback(error, null);
	      
        users[user] = JSON.parse(data);

        request.get(users[user].data.avatar.large, function(err, response, body) {
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
    async.map(Object.keys(users), function(user, callback) {
	    oa.getProtectedResource('http://sandbox-api.geekli.st/v1/users/' + user + '/cards', 'GET', creds.ACCESS_TOKEN, creds.ACCESS_TOKEN_SECRET,  function (error, data, response) {
	      var cardsResult = JSON.parse(data);

	      for (var cardIdx=0; cardIdx<cardsResult.data.cards.length; cardIdx++) {
	        cards.push({
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
	
  var express = require('express')
    , routes = require('./routes');

  var app = module.exports = express.createServer();

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

  app.get('/', routes.index);

  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

});