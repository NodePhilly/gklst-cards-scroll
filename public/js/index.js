var cardCount;
var currentCard;

var scrollPositions = {
	geeklist: 0
};

$(document).ready(function() {
	cardCount = $('.tile').length;
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