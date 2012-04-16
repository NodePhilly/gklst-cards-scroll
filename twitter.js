var twitter = require('ntwitter')
  , EventEmitter = require('events').EventEmitter  
  , credentials = require('./twitter-creds.json');

exports.init = function(callback) {
  var twit = new twitter(credentials);

  var twitStream = new EventEmitter();

  twit.stream('statuses/filter', { track: '#obama' }, function(stream) {
    stream.on('data', function(data) {
      twitStream.emit('tweet', {
        id: data.id,
        user: {
          avatar: data.user.profile_image_url,
          screen_name: data.user.screen_name
        },
        text: data.text
      });
    });

    stream.on('error', function(data) {
      twitStream.emit('tweet', {
        id: data.id,
        user: {
          avatar: data.user.profile_image_url,
          screen_name: data.user.screen_name
        },
        text: data.text
      });
    });
  });

  callback(twitStream);
};