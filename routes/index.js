
/*
 * GET home page.
 */
var state = require('../data/state');

// TODO: add middleware to route phone to controller and non-phone to game
exports.index = function(req, res){
  res.render('index', { title: 'rControl' })
};

exports.game = function(req, res){
  res.render('game', { title: 'Game', id: state.game.getNewGameId() })
};

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

exports.controller = function(req, res){
  res.render('controller', { title: 'Controller', layout: 'controller' })
};
