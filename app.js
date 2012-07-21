/**
 * Module dependencies.
 */

var express = require('express')
, _ = require('underscore')
, routes = require('./routes/index')
, app = express.createServer()
, io = require('socket.io').listen(app)
, state = require('./data/state')
, gsockets = []
, csockets = [];

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/jsnes'));
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

	// keep track of the latency for our socket
	setInterval(function() {
		socket.emit('ping', {d: Date.now()})
	},2000);
	socket.on("pong", function(data) {
		console.log(socket.id, "latency:", (Date.now() - data.d)/2.0, "ms");
	});

	// controller data
	socket.on('c',function(data) {
		console.log(data);
		_.each(gsockets, function(gamesocket) {
			console.log(data, ">", gamesocket.id);
			gamesocket.emit('g', data);
		})
	});

	socket.on('controller_register', function(data) {
		if (!_.contains(csockets,socket)) {
			csockets.push(socket);
			// notify the games 
			_.each(gsockets, function(gamesocket) {
				gamesocket.emit('controller_register', data);
			});
			console.log("controllers:", _.pluck(csockets, 'id'));
		}

		socket.on('disconnect', function() {
			var index = csockets.indexOf(socket);
			if (index >= 0) {
				csockets.splice(index,1);
			}
			console.log("controllers:", _.pluck(csockets, 'id'));
		});
	});

	socket.on('game_register', function(data) {
		console.log(socket.id, ">", data);
		if (!_.contains(gsockets,socket)) {
			gsockets.push(socket);
			socket.emit('game_register', {id: socket.id});
			console.log("games:", _.pluck(gsockets, 'id'));
		}

		// remove from game sockets
		socket.on('disconnect', function() {
			var index = gsockets.indexOf(socket);
			if (index >= 0) {
				gsockets.splice(index,1);
			}
			console.log("games:", _.pluck(gsockets, 'id'));
		});
	});


});

// Routes
app.get('/', routes.index);
app.get('/game', routes.game);
app.get('/controller', routes.controller);

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

