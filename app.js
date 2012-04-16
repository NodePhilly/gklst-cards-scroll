var async    = require('async')
  , twitter  = require('./twitter')
  , geeklist = require('./geeklist');

cache = {
    geeklist: {}
  , tweets: []
};

async.series([

  function(callback) {
  	geeklist.init(function(data) {
      cache.geeklist = data;

      callback();
    });
  },

  function(callback) {
    twitter.init(function(stream) {
      stream.on('tweet', function(tweet) {
        cache.tweets.push(tweet)
      });

      callback();
    });
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
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.get('/', routes.index);

  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

});