
/*
 * GET home page.
 */
var state = require('../data/state');

var is_mobile = function(req) {
	var ua = req.header('user-agent');
	if (/mobile/i.test(ua)) return true;
	else return false;
}

/* send mobile devices to the controller page, other devices to the game page */
exports.index = function(req, res){
	if (is_mobile(req)) res.render('controller', { title: 'controller' });
	else {
		// get game ID
		(res.render('game', {title: 'Game', id:'...'}));
	};
};

exports.game = function(req, res){
  res.render('game', { title: 'JSNES ', id: state.game.getNewGameId() })
};

exports.controller = function(req, res){
	res.render('controller', { title: 'Controller', layout: 'controller' })
};

exports.benchmark = function(req, res){
	res.render('benchmark', { title: 'Benchmark', layout: 'benchmark' })
};

/*
exports.game_existing = function(req, res){
	// need to pass in ID:
	console.log(req.params);
	if (state.game.gameIdExists(req.params.id)){
		res.render('game', { title: 'Game', id: req.params.id });
  }
  else {
  	throw new NotFound;
  }
};
*/
