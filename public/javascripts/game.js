(function($) {
	var nes;
	$(document).ready(function() {
		var socket = io.connect('/'), $doc = $(document);

		socket.on("connect", function (data) {
			$("#log").text("connected to websockets");

			socket.emit('game_register',{})
			.on('game_register', function(data) {
					$("#gameid").text(data.id);
					$("#log").text("registered, waiting for controller");
			});

		});

		socket.on("controller_register", function (data) {
			$("#log").html("controller registered");
		});

		socket.on("g", function (data) {
			console.log("controller input:", data);
			var input = JSON.parse(data);
			$("#log").html("pressed: "+ input.p + "<br/> released: " + input.r);
			nes.ui.sendInput({ press: input.p, release: input.r});
		});

		socket.on("ping", function(data) {
			socket.emit("pong", data);
		});
		

		nes = new JSNES({
			'ui': $('#emulator').JSNESUI({
				/*
				"Homebrew": [
					['Concentration Room', 'roms/croom/croom.nes'],
					['LJ65', 'roms/lj65/lj65.nes'],
				],
				*/
				"Testing": [
					['Contra', 'local-roms/Contra.nes'],
					['Mario Brothers', 'local-roms/Mario Bros.nes'],
					['Super Mario Brothers 3', 'local-roms/Super Mario Bros 3.nes'],
				],
			})
		});

	});
})(jQuery);
