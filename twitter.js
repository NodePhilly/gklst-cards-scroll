var twitter = require('ntwitter')
  , EventEmitter = require('events').EventEmitter  
  , credentials = require('./twitter-creds.json');

exports.init = function(callback) {
  var twit = new twitter({
    consumer_key: 'f634xNy9wp9VcoY5V8ygA',
	consumer_secret: '2stzJoEjXiN8nvynN3eL9YroIdAbsjlLGmT2M3gzs',
	access_token_key: '104793047-luKK7cCdk3no6AZJH79i4R3RGsMLDUuBGxUTsmZG',
	access_token_secret: 'BtpogtuaSHEjoSsRp8nT9DCz6wPfkzGEoHmPMDhk'
  });

  var stream = new EventEmitter();

  twit.search('#nodephilly OR @NodePhilly', function(err, data) {
    if (err) { 
      console.log(err);
      return; 
    }
    
    for (var i=0; i<data.results.length; i++) {
      stream.emit('tweet', {
        id: data.results[i].id,
        user: {
          screen_name: data.results[i].from_user
        },            
        text: data.results[i].text
      });
    }
    
    twit.stream('statuses/filter', { track: '#nodephilly' }, function(stream) {
	  stream.on('data', function(data) {
	    io.sockets.emit('tweet', data);
	  });
	});
  });

  callback(stream);
};