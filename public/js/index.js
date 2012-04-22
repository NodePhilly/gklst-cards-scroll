// ** DEPENDENCIES:
// **
// **   1) Queue.compressed.js
// **

$(document).ready(function() {	
  loadCardsQueue(function() {	  
    scrollCards();
    scrollTweets();
    rotateSponsors();
  });
});

// ################  GEEKLIST
var cardQueue = new Queue();

function createCardElement(card) {
  return ' \
	<section class="tile"> \
	  <section class="user-image"> \
	    <img src="' + card.user.avatar + '" /> \
	  </section> \
	  <section class="right"> \
	    <h4>' + card.headline + '</h4> \
	    <p>' + card.user.name + '</p> \
	  </section> \
	  <div class="clear"></div> \
    </section>';
};

function loadCardsQueue(callback) {
  $.get('/cards', function(result) {
    for (var i = 0; i < result.length; i++) {
      cardQueue.enqueue(result[i]);
      $('#geeklist').append(createCardElement(result[i]));
	}

	callback();
  });
};

function scrollCards() {
  var lastCard = $('#geeklist .tile:last');
  var lastCardClone = lastCard.clone();

  lastCardClone.hide().prependTo($('#geeklist')).fadeIn(1500, function() {
  	lastCard.remove();

  	setTimeout(scrollCards, 3000);  	
  });
};

// ################  TWEETS
var tweetQueue = new Queue();

function createTweetElement(tweet) {
	return $('\
	  <section class="tile" id="' + tweet.id + '">\
	    <section class="user-image">\
	      <img src="' + tweet.user.avatar + '" />\
	      <div class="clear" />\
	    </section>\
	    <section class="right">\
	      <h4>' + tweet.text + '</h4>\
	      <p>@' + tweet.user.screen_name + '</p>\
	      <div class="clear" />\
	    </section>\
	    <div class="clear" />\
	  </section>');
};

var socket = io.connect('/');
socket.on('tweet', function(tweet) {
	tweetQueue.enqueue(tweet);
});

function scrollTweets() {
  var newTweet = tweetQueue.dequeue();

  if (newTweet) {
  	var tweetElement = createTweetElement(newTweet);
  	tweetElement.hide().prependTo($('#tweets')).fadeIn(2000, function() {
  	  setTimeout(scrollTweets, 3000);
  	});
  } else {
    var lastTweet = $('#tweets .tile:last');

    if (lastTweet.length > 0) {
      var lastTweetClone = lastTweet.clone();

      lastTweetClone.hide().prependTo($('#tweets')).fadeIn(2000, function() {
  	    lastTweet.remove();
  	    setTimeout(scrollTweets, 3000);
      });
    } else {
    	setTimeout(scrollTweets, 3000);
    }
  }
};

// ################  SPONSORS
var sponsorQueue = new Queue();
sponsorQueue.enqueue('10gen');
sponsorQueue.enqueue('aca-video');
sponsorQueue.enqueue('andYet');
sponsorQueue.enqueue('chatham');
sponsorQueue.enqueue('comcastlabs');
sponsorQueue.enqueue('couchbase');
sponsorQueue.enqueue('energyplus');
sponsorQueue.enqueue('geeklist');
sponsorQueue.enqueue('nodejitsu');
sponsorQueue.enqueue('saucelabs');
sponsorQueue.enqueue('uber');
sponsorQueue.enqueue('voltdb');
sponsorQueue.enqueue('voxer');
sponsorQueue.enqueue('zivtech');

function rotateSponsors() {  
  var nextSponsor = sponsorQueue.dequeue();
  sponsorQueue.enqueue(nextSponsor);

  var nextSponsorElement = $('\
      <div class="logo">\
        <img src="/img/sponsors/' + nextSponsor + '-logo.png" />\
      </div>\
    ');

  var currentSponsorElement = $('#sponsors .logo');

  if (currentSponsorElement.length > 0) {
    currentSponsorElement.fadeOut(2000, function() {
      currentSponsorElement.remove();

      nextSponsorElement.hide().appendTo($('#sponsors')).fadeIn(2000, function() {
        setTimeout(rotateSponsors, 5000);
      });
    });
  } else {
    nextSponsorElement.hide().appendTo($('#sponsors')).fadeIn(2000, function() {
      setTimeout(rotateSponsors, 5000);
    });
  }
};