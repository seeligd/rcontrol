
(function () {

	var inlinelog, socket = io.connect('/');

	log = function() {
			$("#output").append(arguments[0],"<br/>");
	}


	$(document).ready(function() {

		var runTest = function(test,count,delay) {
			var results = [];
			var sent = 0;

			log("running...");

			socket.on("pong", function(data) { 
				results.push(Date.now() - data.d );
			});

			var testInterval = setInterval( function() {
				count--;
				test();
				sent++;

				if (count <= 0) {

					clearInterval(testInterval);

					// wait just a bit longer for any results to come in
					setTimeout(function() {
						log("results:");
						var min = _.min(results);
						var max = _.max(results);
						var mode = results.sort()[Math.floor(results.length / 2)];
						var avg = _.reduce(results, function(memo, num) { return memo + num;}, 0) / results.length;

						log("<strong>sent</strong>: " + sent + " <strong>rec'd</strong>: " + results.length + " (every " + delay + "ms)");
						log("<strong>latency</strong> min: " + min + "ms max: " + max + "ms avg: " + avg.toPrecision(5) +"ms median: " + mode + "ms");
					},delay*3);

				}
			},delay);
		}

		$("button#test").click(function(e) {
			var t1 = function() {
				socket.emit("ping", { d: Date.now() });
			}

			/* - apparently this is only a server-side thing:
			var t2 = function() {
				socket.volatile.emit("ping", { d: Date.now() });
			}
			*/
			runTest(t1, 500, 2);
		});

	});
})(jQuery);


