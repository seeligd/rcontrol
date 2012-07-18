
(function () {

	var inlinelog;
	//var socket = io.connect('/');
	log = function() {

			//inlinelog.prepend(Array.prototype.slice.call(arguments));
			//console.log(Array.prototype.slice.call(arguments));
			//console.log(JSON.parse(arguments[0]));
			inlinelog.prepend(arguments[0],"<br/>");
			//console.log(inlinelog);
		}

	var click = function(id, direction) {
		console.log(id, direction);
		socket.emit('controller', { 
			data: {
				button: id,
				direction: direction
			}
		});
	};

	$(document).ready(function() {
		inlinelog = $("#log");

		//socket.emit('controller', { info: 'controller - DOM ready' });

		var buttonState = {}, currentlyPressed = {}, mouseDown = false;

		$(".button").each(function(i,e) {
			// get top/left/bottom/right
			var b = $(e);
			var offset = b.offset();
			//console.log(b.attr('id'), Math.round(offset.left), b.width(), Math.round(offset.top), b.height() );
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
				}
			}
		});

		// subscribe to touch start, move and end events
		// on start, if over a key, push that key down
		// on move
		// 	check all coordinates for matches, uncheck anything that doesn't have a match
		// on end
		//  check all touches for matches, uncheck anything that doesn't have a match
		//

		var updateButtons = function(x,y,pressed) {
			for(var b in buttonState) {
				if (buttonState[b].intersect(x,y)) {
					pressed[b] = true;
				}
			}
		}

		var handleTouchEvent = function(event,type) {
			var pressed = {};
			//var coords = [];
			for (var i=0; i<event.touches.length; i++) {
				if (event.touches[i].pageX) {
					var x = event.touches[i].pageX, y = event.touches[i].pageY;
					updateButtons(x,y,pressed)
				}
			}

			// update all button statuses 
			/*
			for(var b in buttonState) {
					buttonState[b].pressed = (pressed[b] === true);
			}
			*/

			if (!_.isEqual(currentlyPressed, pressed)) {
				var p =[];
				for(var b in pressed) {
					p.push(b);
				}
				log(p.join(" "));
				currentlyPressed = pressed;
			}
		}

		//var element = document.getElementById('buttonscontainer');
		//element.addEventListener("touchstart", touchStart, false);
		$("#buttonscontainer")
		.bind('touchstart', function (e) {
			handleTouchEvent(e.originalEvent,'start');
		})
		/*
		$("#buttonscontainer")
		.bind('touchend', function (e) {
			handleTouchEvent(e.originalEvent,'end');
		})
		.bind('touchmove', function (e) {
			handleTouchEvent(e.originalEvent,'move');
		})
		*/
		/*
		.bind('mousemove', function(e) {
			if (mouseDown) {
				updateButtons(e.pageX, e.pageY);
			}
		})
		.bind('mousedown', function (e) { 
			//updateButtons(e.pageX, e.pageY);
			mouseDown = true;
		})
		.bind('mouseup', function(e) {
			//updateButtons(e.pageX, e.pageY, true);
			mouseDown = false;
		})
		*/

		document.ontouchmove = function(event) {
			event.preventDefault();
		}

	});
})(jQuery);


