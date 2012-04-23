var fs          = require('fs')
  , async       = require('async')
  , request     = require('request')
  , im          = require('imagemagick')
  , OAuth       = require('oauth').OAuth;

exports.init = function(callback) {

	var alldata = {
		users: {},
		cards: []
	};

	var oa = new OAuth(
	  "http://api.geekli.st/v1/oauth/request_token",
	  "http://api.geekli.st/v1/oauth/access_token",
	  process.env.GKLST_CONSUMER_KEY,
	  process.env.GKLST_CONSUMER_SECRET,
	  "1.0",
	  null,
	  "HMAC-SHA1"
	);

	async.series([

	  function(seriesCallback) {
        oa.getProtectedResource('http://api.geekli.st/v1/users/NodePhilly/followers?page=1&count=50', 'GET', process.env.GKLST_ACCESS_TOKEN, process.env.GKLST_ACCESS_TOKEN_SECRET, function(error, data, response) {
          if (!error) {
            var result = JSON.parse(data);

            var followersPage = 1;
            var followersRetrieved = 0;
            var total_followers = result.data.total_followers;

            for (var i=0; i<result.data.followers.length; i++) {
          	  alldata.users[result.data.followers[i].screen_name] = result.data.followers[i];
          	  followersRetrieved++;
            }          

            async.whilst(
              function() { console.log(total_followers); console.log(followersRetrieved); return followersRetrieved < total_followers; },
              function(callback) {
                oa.getProtectedResource('http://api.geekli.st/v1/users/NodePhilly/followers?page=' + (++followersPage) + '&count=50', 'GET', process.env.GKLST_ACCESS_TOKEN, process.env.GKLST_ACCESS_TOKEN_SECRET, function(error, data, response) {
                  var pageResult = JSON.parse(data);

                  for (var i=0; i<pageResult.data.followers.length; i++) {
              	    alldata.users[pageResult.data.followers[i].screen_name] = pageResult.data.followers[i];
              	    followersRetrieved++;
                  }

                  callback();
                });
              }, seriesCallback);          
          } else {
          	console.log(error);
          	seriesCallback();
          }
        });
	  },

	  function(seriesCallback) {
	  	async.map(Object.keys(alldata.users), function(user, callback) {
	  	  oa.getProtectedResource('http://api.geekli.st/v1/users/' + user, 'GET', process.env.GKLST_ACCESS_TOKEN, process.env.GKLST_ACCESS_TOKEN_SECRET,  function (error, data, response) {
		    if (!error) {
	          alldata.users[user] = JSON.parse(data);

	          request.get(alldata.users[user].data.avatar.large, function(err, response, body) {
                console.log('got avatar for %s', user);

	            fs.readFile('public/img/geeks/' + user + '-large.jpg', 'binary', function(err, data) {
	              im.resize({
	                srcPath: 'public/img/geeks/' + user + '-large.jpg',
	                dstPath: 'public/img/geeks/' + user + '.jpg',
	                width: 300
	              }, callback);
	            });
	          }).pipe(fs.createWriteStream('public/img/geeks/' + user + '-large.jpg'));
	        } else {
	          callback();
	        }
		  });
		}, seriesCallback);
	  },

	  function(seriesCallback) {
	    async.map(Object.keys(alldata.users), function(user, callback) {
		    oa.getProtectedResource('http://api.geekli.st/v1/users/' + user + '/cards', 'GET', process.env.GKLST_ACCESS_TOKEN, process.env.GKLST_ACCESS_TOKEN_SECRET,  function (error, data, response) {
		      var cardsResult = JSON.parse(data);

		      if (!error) { 
		      	console.log('got %s cards for %s', cardsResult.data.cards.length, user);		      		     

		        for (var cardIdx=0; cardIdx<cardsResult.data.cards.length; cardIdx++) {
		          alldata.cards.push({
		      	    headline: cardsResult.data.cards[cardIdx].headline,
		            user: {
	                  name: user,
	                  avatar: '/img/geeks/' + user + '.jpg'
	                }
		          });
		        }
		      }

		      callback();
		    });
		  }, seriesCallback);
	  }

	], function() {
	  
	  console.log('geeklist data loaded');
	  callback(alldata);

	});
};