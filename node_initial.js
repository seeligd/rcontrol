var express = require('express'), app = express.createServer()
, io = require('socket.io').listen(app);

app.listen(80);

var registeredControllers = {};

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/controller.html');
});

app.get('/game', function (req, res) {
	res.sendfile(__dirname + '/game.html');
});

app.use("/static", express.static(__dirname + '/static'));

io.sockets.on('connection', function (socket) {
	//socket.emit('news', { hello: 'world' });
	console.log('connection opened');

	socket.on('controller', function (data) {
		// pass controller messages to the game
		console.log('controller:',data);
		socket.broadcast.emit('game', data);
	});
	socket.on('game', function (data) {
		console.log('game:',data);
	});
});
