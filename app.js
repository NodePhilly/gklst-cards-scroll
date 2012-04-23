var async    = require('async')
  , twitter  = require('./twitter')
  , geeklist = require('./geeklist');

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);

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
app.get('/cards', routes.cards);

cache = {
    geeklist: {}
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
        io.sockets.emit('tweet', tweet);
      });

      callback();
    });
  }

], function() {
  console.log('server ready');
  app.listen(3500);  

});