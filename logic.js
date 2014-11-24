logic = {
	makeSingleDiceCombinations : function(array, dice) {
		var die;
		for (var i=0; i<dice.length; i++){
			die = dice[i];
			if (logic.getSingleDieScore(die)){
				array.push([die]);
			}
		};
		return array;
	},
	makeThreeDiceCombinations : function(array, dice) {
		if (dice.length < 3) {
			console.log("ERROR, makeThreeDiceCombinations called with < 3 dice.")
		};
		var d1, d2, d3;
		var toPush;
		for (var i=0; i<dice.length-2; i++) {
			for (var j=i+1; j<dice.length-1; j++) {
				for (var k=j+1; k<dice.length; k++) {
					toPush = [];
					toPush.push(dice[i]);
					toPush.push(dice[j]);
					toPush.push(dice[k]);
					console.log(toPush);
					if (logic.getThreeDieScore(toPush)) {
						console.log("Pushing...");
						array.push(toPush);
					}
				}
			}
		}
		return array
	},
	makeSixDiceCombinations : function(array, dice) {
		if (dice.length != 6) {
			console.log("ERROR, makeSixDiceCombinations called without 6 dice.");
		}
		var allSixDice = dice.slice(0);
		if (logic.getSixDieScore(allSixDice)) {
			array.push(allSixDice);
		}
	},
	makeCombinations : function(dice) {
		var combinations = [];
		if (dice.length == 6) {
			this.makeSixDiceCombinations(combinations, dice);
		}
		if (dice.length >= 3) {
			this.makeThreeDiceCombinations(combinations, dice);
		}
		if (dice.length >= 1) {
			this.makeSingleDiceCombinations(combinations, dice);
		}
		return combinations;
	},
	scoreDice : function(dice) {
		var combinations = logic.makeCombinations(dice)
		return combinations;
	},
	getSingleDieScore : function(die) {
		var val = die.val;
		if (val == 1) {
			return 100;
		};
		if (val == 5) {
			return 50;
		};
		return 0;
	},
	getThreeDieScore : function(threeDice){
		var vals = [];
		var tripleScore;
		var triple;
		if (threeDice.length != 3){
			alert('error, called getThreeDieScore w/ less than 3 dice.');
		};
		for (var i=0; i < 3; i++){
			vals.push(threeDice[i].val);
		};
		if (vals[0] == vals[1] && vals[0] == vals[2]){
			triple = vals[0];
			if (triple == 1){
				tripleScore = 1000;
			} else {
				tripleScore = 100 * triple;
			}
		} else {
			tripleScore	= 0;
		};
		return tripleScore;
	},
	getSixDieScore : function(sixDice){
		var dice = sixDice;
		var val, lastVal;
		var score = 0;
		var isStraight = true;
		var isSixKind = true;
		var isThreePair = false;
		var seen = [];
		var counts = [0, 0, 0, 0, 0, 0];
		lastVal	= dice[0].val;
		for (var i=0; i<dice.length; i++) {
			val = dice[i].val;
			counts[val-1] += 1;
			if (val != lastVal){
				isSixKind = false;
			}
			if (seen.indexOf(val) > -1) {
				isStraight = false;
			}
			seen.push(val);
			lastVal = val;
		}
		if (isStraight){
			return 1000;
		}
		if (isSixKind) {
			if (seen[0] == 1){
				return 2000;
			} else {
				return 1250;
			}
		}
		if ((counts.indexOf(1) + counts.indexOf(3) + counts.indexOf(5)) == -3){
			isThreePair = true;
			return 750;
		}
		return 0;
	},
	isCompleteHand : function(dice){
		var numDice = dice.length;
		if (numDice == 1) {
			return this.getSingleDieScore(dice[0])
		};
		if (numDice == 2) {
			var die0score = this.getSingleDieScore(dice[0]);
			var die1score = this.getSingleDieScore(dice[1]);
			if (die0score && die1score) {
				return die0score + die1score;
			} else {
				return 0;
			}
		};
		if (numDice == 3) {
			return getThreeDieScore(dice);
		};
		if (numDice == 6) {
			return getSixDieScore(dice);
		};
	},
	handDoesBust : function(dice){
		var die, val;
		var diceToTest = [];
		for (var i=0; i<dice.length; i++){
			die = dice[i];
			if (die.state != 'locked'){
				diceToTest.push(die);
			}
		};
		if (logic.scoreDice(diceToTest).length){
			return false;
		} else {
			return true;
		}

		// TODO : fix logic
		return true;
	},
	isValidSelection : function(dice){
	},
	getScoreFromDice : function(dice) {
		if (dice.length == 0) {
			return 0;
		};
		if (dice.length == 1) {
			var val = dice[0].val;
			if ([1,5].indexOf(val) == -1) {
				return 0;
			} else {
				if (val == 1){
					return 100;
				} else {
					return 50;
				};
			}
		}
	}
}