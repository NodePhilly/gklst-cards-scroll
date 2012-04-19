// ** DEPENDENCIES:
// **   1) Queue.compressed.js
// **
// **

$(document).ready(function() {	
	loadCardsQueue(function() {
	  setInterval(scrollCards, 3000);
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
  var firstCardClone = $('#geeklist section:first').clone();

  $('#geeklist section:first').slideUp(1000, function() {
  	$(this).remove();
  	$('#geeklist').append(firstCardClone);
  });
};

// ################  TWEETS
var socket = io.connect('/');
socket.on('tweet', function(tweet) {
	var markup = '\
		<section class="tile" id="' + tweet.id + '" style="display: none;">\
		    <section class="user-image">\
		      <img src="' + tweet.user.avatar + '" />\
		    </section>\
		    <section class="right">\
		      <h4>' + tweet.text + '</h4>\
		      <p>@' + tweet.user.screen_name + '</p>\
		    </section>\
		    <br class="clear" />\
		</section>';
	
	$('#tweets').queue(function() {
		var container = $(this);
		container.prepend(markup);

		$('#' + tweet.id).fadeIn(1000, function() {
			container.dequeue();
		});
	});
});