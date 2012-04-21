// ** DEPENDENCIES:
// **
// **   1) Queue.compressed.js
// **

$(document).ready(function() {	
  loadCardsQueue(function() {	  
    scrollCards();
    scrollTweets();
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