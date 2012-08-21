
(function () {

	var inlinelog, socket = io.connect('/'), buttonState = {}, currentlyPressed = {};
	
	log = function() {
		inlinelog.prepend(arguments[0],"<br/>");
	}

	var updateInputPositions = function(event) {
		// get the locations of all the buttons that might get hit frequently (not select/start) 
		$(".button").each(function(i,e) {
			var b = $(e);
			var offset = b.offset();
			buttonState[b.attr('id')] = {
				height: b.height(),
				width: b.width(),
				top: Math.round(offset.top),
				left: Math.round(offset.left),
				bottom: Math.round(offset.top) + b.height(),
				right: Math.round(offset.left) + b.width(),
				pressed: false,
				intersect : function(x,y) {
					return ( this.left <= x && x <= this.right ) && (this.top <= y && y <= this.bottom);
				},
				button: b
			}
		});
		switch(window.orientation) 
		{  
			case -90:
			case 90:
				// landscape
				break;
			default:
				//alert('recommend landscape mode');
				break; 
		}
	
	};

	window.onorientationchange = updateInputPositions;

	$(document).ready(function() {
		updateInputPositions("init");

		inlinelog = $("#log");

		// show controller after connecting
		socket.on("connect", function (data) {
				$("#info").text("connected").animate({ top: -1000},500, function() {
					$("#element").animate({opacity: 1});
				});
				socket.emit("controller_register",{});
		});

		// keep track of latency
		socket.on("ping", function(data) {
			socket.emit("pong", data);
		});



		// subscribe to touch start, move and end events
		// on each event, iterate through all touches and map touch locations to buttons

		// add any 'pressed' buttons to the hash of pressed buttons - TODO: optimize
		var updateButtons = function(x,y,pressed) {
			for(var b in buttonState) {
				if (buttonState[b].intersect(x,y)) {
					pressed[b] = true;
				}
			}
		}

		// for each touch event, go through the touches and figure out which buttons are being pressed
		var handleTouchEvent = function(event) {

			var pressed = {};
			var i = event.touches.length;
			//log(event.touches.length);
			while(i--) {
				//log("loop: " + i + "px" + event.touches[i].pageX);
				if (event.touches[i].pageX) {
					var x = event.touches[i].pageX, y = event.touches[i].pageY;
					updateButtons(x,y,pressed)
				}
			}

			var currentButtons = _.keys(currentlyPressed);
			var nextButtons = _.keys(pressed);

			var toPress = _.difference(nextButtons,currentButtons);
			var toRelease = _.difference(currentButtons, nextButtons);

			// if something changed, send to server
			if (toPress.length > 0 || toRelease.length > 0) {
				socket.emit('c', { p: toPress, r: toRelease, d: Date.now()});
				//log("+ " + toPress.join(",") + " - " + toRelease.join(","));

				// add pressed class to pressed
				//_.each(toPress,function(b) { buttonState[b].button.addClass('pressed'); log(" p:" + b); });
				//_.each(toRelease,function(b) { buttonState[b].button.removeClass('pressed'); });
			}

			// these are our new buttons
			currentlyPressed = pressed;
			log(JSON.stringify(_.keys(pressed)));
		}

		//var element = document.getElementById('buttonscontainer');
		//element.addEventListener("touchstart", touchStart, false);
		$("#buttonscontainer")
		.bind('touchstart', function (e) {
			log("start");
			handleTouchEvent(e.originalEvent);
		})
		.bind('touchend', function (e) {
			log("end");
			handleTouchEvent(e.originalEvent);
		})
		.bind('touchmove', function (e) {
			//log("move");
			handleTouchEvent(e.originalEvent);
		})
		.bind('mouseup', function(e) {
			log('up');
		});

		// these don't need to be optimized since they're not used during game play
		$("#start").bind('touchstart', function(e) {
			socket.emit('c', { p: ['start'], r: [], d: Date.now()});
		}).bind('touchend', function(e) {
			log('start touch end');
			socket.emit('c', { p: [], r: ['start'], d: Date.now()});
		});
		
		$("#select").bind('touchstart', function(e) {
			socket.emit('c', { p: ['select'], r: [], d: Date.now()});
		}).bind('touchend', function(e) {
			log('select touch end');
			socket.emit('c', { p: [], r: ['select'], d: Date.now()});
		});

		$("#start").bind('click', function(e) {
			log("click start");
		});
		$("#select").bind('click', function(e) {
			log("select");
		});

		document.ontouchmove = function(event) {
			event.preventDefault();
		}

	});
})(jQuery);


