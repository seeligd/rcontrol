/**
 * Module dependencies.
 */

var express = require('express')
, _ = require('underscore')
, routes = require('./routes/index')
, app = express.createServer()
, io = require('socket.io').listen(app)
, state = require('./data/state')
, gamesockets = [];

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});


app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// don't be so chatty:
io.set('log level',1);

io.sockets.on('connection', function(socket) {
	console.log("connection on websockets id:", socket.id);

	socket.on('controller',function(data) {
		console.log(data);
		_.each(gamesockets, function(gamesocket) {
			console.log(data, ">", gamesocket.id);
			gamesocket.emit('game', { press: data.press, release: data.release});
		})

	});

	socket.on('game', function(data) {
		console.log(socket.id, ">", data);
		if (!_.contains(gamesockets,socket)) {
			console.log("gamesockets", _.pluck(gamesockets, 'id'));
			gamesockets.push(socket);
			console.log("gamesockets", _.pluck(gamesockets, 'id'));
		}

		// remove from game sockets
		socket.on('disconnect', function() {
			console.log("gamesockets", _.pluck(gamesockets, 'id'));
			var index = gamesockets.indexOf(socket);
			if (index >= 0) {
				gamesockets.splice(index,1);
			}
			console.log("gamesockets", _.pluck(gamesockets, 'id'));
		});
	});


});


// Routes
app.get('/', routes.index);
app.get('/game', routes.game);
app.get('/game/:id', routes.game_existing);
app.get('/:id', routes.controller);

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

