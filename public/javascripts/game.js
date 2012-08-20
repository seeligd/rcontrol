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
      // send input to nes before updating HTML or logging
			nes.ui.sendInput({ press: data.p, release: data.r });
			$("#log").html("pressed: "+ data.p + "<br/> released: " + data.r + "<br/>latency:" + (Date.now() - data.d) + "ms");
      console.log("controller input:",data);
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
					['Mario Brothers (local)', 'roms/smb.nes'],
					['Super Mario Brothers 3', 'local-roms/Super Mario Bros 3.nes'],
					['Super Mario Brothers', 'roms/smb.nes'],
				],
			})
		});

	});
})(jQuery);
