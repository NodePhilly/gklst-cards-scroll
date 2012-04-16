function shuffle(arr) {
	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	return arr;
}

exports.index = function(req, res) {
	res.render('index', {
		  geeklistcards: shuffle(cache.geeklist.cards)		
		, tweets: cache.tweets
		, title: 'Node.Philly Live!'
	});
};