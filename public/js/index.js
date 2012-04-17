// ################  GEEKLIST
var cardCount;
var currentCard;

var scrollPositions = {
	geeklist: 0
};

$(document).ready(function() {
	cardCount = $('#geeklist .tile').length;
	currentCard = -1;

	scrollToNextCard();
	setInterval(scrollToNextCard, 5000);
});

function scrollToNextCard() {
	currentCard = (currentCard+1 < cardCount) ? currentCard+1 : 0;

	var previousCard = '#card-' + (currentCard-1);
	var thisCard = '#card-' + currentCard;


	scrollPositions.geeklist = (currentCard>0)
		? scrollPositions.geeklist + $(previousCard).outerHeight(true)
		: 0;

	$('#geeklist').animate({ scrollTop: scrollPositions.geeklist }, 1000, function() {
		$(previousCard).css({ opacity: 1.0 });
		$(thisCard).css({ opacity: 1 });
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
		      <h4>' + injectLinks(tweet.text) + '</h4>\
		      <p>' + injectLinks("@" + tweet.user.screen_name) + '</p>\
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

function injectLinks(text) {	
	var result = text.replace(/([a-zA-Z]*:\/\/[a-zA-Z0-9\.\-\/]*)/g, '<a href="$1" target="_blank">$1</a>'); // links
	result = result.replace(/@([a-zA-Z0-9_]*)/g, '<a href="http://www.twitter.com/$1" target="_blank">@$1</a>'); // users	
	result = result.replace(/#([a-zA-Z0-9]*)/g, '<a href="https://twitter.com/#!/search/%23$1" target="_blank">#$1</a>'); // hashtags
	return result;
};