function shuffle(arr) {
  for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr;
}

exports.index = function(req, res) {
  res.render('index', {      
	title: 'Node.Philly Live!'
  });
};

exports.cards = function(req, res) {
  res.send(shuffle(cache.geeklist.cards));
};