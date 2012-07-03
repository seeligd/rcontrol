
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Croud Control' })
};

exports.game = function(req, res){
  res.render('game', { title: 'Game Container' })
};

exports.controller = function(req, res){
  res.render('controller', { title: 'Controller', layout: 'controller' })
};
