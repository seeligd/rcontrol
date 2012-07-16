exports.state = function() {
	var currentGames = [];
	// create random game, if it's not already in the list
	var	getNewGameId = function() {
		var candidate = Math.floor(Math.random()*10000);
		while(currentGames.contains(candidate)) {
			candidate = Math.floor(Math.random()*10000);
		}
		return candidate; 
	};

	return { getNewGame: getNewGameId };
};
