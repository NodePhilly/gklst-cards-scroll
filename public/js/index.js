var cardCount;
var currentCard;
$(document).ready(function() {
	cardCount = $('.card').length;
	currentCard = -1;

	scrollToNextCard();
	setInterval(scrollToNextCard, 5000);
});

function scrollToNextCard() {
	currentCard = (currentCard+1 < cardCount) ? currentCard+1 : 0;

	var previousCard = '#card-' + (currentCard-1);
	var thisCard = '#card-' + currentCard;

	$('html, body').animate({ scrollTop: $(thisCard).offset().top - 100 }, 1000, function() {
		$(previousCard).css({ opacity: 0.3 });
		$(thisCard).css({ opacity: 1 });
	});
};