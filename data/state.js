(function () {

	var _ = require('underscore');
	var currentGames = [], keylength = 100000

	exports.game = {
		getNewGameId : function() {
			var k = this.generateId();
			console.log("getNewGameId", k);

			while(this.gameIdExists(k)) {
				k = this.generateId();
			}

			currentGames.push(k);
			console.log("returning candidate:", k, currentGames);
			return k; 

		},
		gameIdExists: function(id) {
			console.log("gameIdExists?", id);
			return (_.contains(currentGames,parseInt(id)));
		},
		generateId: function() {
			return Math.floor(Math.random()*100000);
		},
		currentGames: function() {
			return currentGames;
		}
	}
})();
