function shuffle(arr) {
	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	return arr;
}

exports.index = function(req, res) {
	var shuffledCards = shuffle(cards);

	res.render('index', {
		cards: shuffledCards,
		title: 'Geekliset Achievement Cards'
	});
};