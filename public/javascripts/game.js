(function($) {
	var output = $("#output");
	var log = function(data) {
		output.prepend("<p>" + data + "</p>");
	}
	$(document).ready(function() {
		var socket = io.connect('/');
		console.log('game ready');

		socket.on("connect", function (data) {
			log("connected. waiting for input");
			socket.emit('game', {info: "game ready for input"});
		});

		socket.on("game", function (data) {
			//console.log("got game data", data);
			$("#output").prepend("<p>+ " + data.press.join(",") + "<br/>- " + data.release.join(",") + "</p>");
		});


	});
})(jQuery);
