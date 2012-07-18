/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes/index')
, app = express.createServer()
, io = require('socket.io').listen(app)
, state = require('./data/state');

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

console.log("app - getting new game ID:", state.game.getNewGameId());

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/game', routes.game);
app.get('/game/:id', routes.game_existing);
app.get('/:id', routes.controller);

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

