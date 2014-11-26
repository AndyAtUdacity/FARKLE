logic = {
	makeSingleDiceCombinations : function(array, dice) {
		// adds (as length-1 arrays) all 1s and 5s from `dice`
		// to input `array`
		var die;
		var score;
		var combination;
		for (var i=0; i<dice.length; i++){
			die = dice[i];
			score = logic.getSingleDieScore(die)
			if (score){
				combination = {
					'dice':[die],
					'score':score
				};
				array.push(combination);
			}
		};
		return array;
	},
	makeThreeDiceCombinations : function(array, dice) {
		// adds (as length-3 arrays) all triples from `dice`
		// to input `array`
		if (dice.length < 3) {
			console.log("ERROR, makeThreeDiceCombinations called with < 3 dice.")
		};
		var d1, d2, d3;
		var toPush;
		var score;
		var combination;
		for (var i=0; i<dice.length-2; i++) {
			for (var j=i+1; j<dice.length-1; j++) {
				for (var k=j+1; k<dice.length; k++) {
					toPush = [];
					toPush.push(dice[i]);
					toPush.push(dice[j]);
					toPush.push(dice[k]);
					score = logic.getThreeDieScore(toPush)
					if (score) {
						combination = {
							'dice':toPush,
							'score':score
						};
						array.push(combination);
					}
				}
			}
		}
		return array
	},
	makeSixDiceCombinations : function(array, dice) {
		// adds all six dice as length 6 array to `array` if
		// they can be scored together (straight, 6-kind, 3-pair).
		var score;
		var combination;
		if (dice.length != 6) {
			console.log("ERROR, makeSixDiceCombinations called without 6 dice.");
		}
		var allSixDice = dice.slice(0);
		score = logic.getSixDieScore(allSixDice)
		if (score) {
			combination = {
				'dice':allSixDice,
				'score':score
			}
			array.push(combination);
		}
	},
	makeCombinations : function(dice) {
		// returns an array of all possible scoring combinations.
		// for example, makeCombinations([1,1,1,1,5,5]) would return
		// [[1,2,3,4,5,6], [1,1,1], [1,1,5,5,1,1], [1], [5]] (though
		// in reality there would be 4 versions of [1,1,1], 4 versions
		// of [1], and 2 of [5]).
		var combinations = [];
		if (dice.length == 6) {
			logic.makeSixDiceCombinations(combinations, dice);
		}
		if (dice.length >= 3) {
			logic.makeThreeDiceCombinations(combinations, dice);
		}
		if (dice.length >= 1) {
			logic.makeSingleDiceCombinations(combinations, dice);
		}
		return combinations;
	},
	getUnused : function(selectedDice, referenceDice) {
		// returns an array of dice which exist in referenceDice but
		// not in selectedDice.
		var unused = [];
		var die;
		for (var i=0; i<referenceDice.length; i++) {
			die = referenceDice[i];
			if (selectedDice.indexOf(die) == -1){
				unused.push(die);
			}
		}
		return unused;
	},
	scoreDice : function(dice){
		// returns an object with `combinations` and `score`
		// properties. `combinations` is an array of combinations
		// and each combination is an array of scoring dice (length 1, 3, or 6)
		var groups = logic.makeGroups(dice);
		var maxScore = 0;
		var bestGroup, group, score;
		if (groups) {
			for (var i=0; i<groups.length; i++){
				group = groups[i];
				score = group['score'];
				if (score > maxScore) {
					bestGroup = group;
					maxScore = score;
				};
			};
			return bestGroup;
		} else {return null}
	},
	makeGroups : function(dice) {
		// returns an array of groups which use all dice. A group has {score : ###, combinations : [...]}.
		// group['combinations']
		var combinations = logic.makeCombinations(dice)
		var combo;
		var group = [];
		var goodGroups = [];
		var unused;
		for (var i=0; i<combinations.length; i++){
			combo = combinations[i];
			group = {
				'combinations':[combo['dice']],
				'score':combo['score']
			};
			unused = logic.getUnused(combo['dice'], dice);
			if (unused.length == 0) {
				goodGroups.push(group);
			} else {
				var compositeGroup;
				var remainderGroups = logic.makeGroups(unused);
				if (remainderGroups) {
					for (var j=0; j<remainderGroups.length; j++){
						compositeGroup = {
							'combinations' : group['combinations'].slice(0),
							'score' : group['score']
						};
						var newGroup = remainderGroups[j];
						compositeGroup['score'] += newGroup['score'];
						for (var k=0; k<newGroup['combinations'].length; k++){
							compositeGroup['combinations'].push(newGroup['combinations'][k]);
						};
						goodGroups.push(compositeGroup);
					};
				};
			};
		};
		if (goodGroups.length == 0) {
			return null;
		} else {return goodGroups};
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
		return Boolean(logic.scoreDice(dice));
	},
	handDoesBust : function(dice){
		if (dice.length == 0) {
			return false;
		}
		var die, val;
		var diceToTest = [];
		for (var i=0; i<dice.length; i++){
			die = dice[i];
			if (die.state != 'locked'){
				diceToTest.push(die);
			}
		};
		var testResult = logic.makeCombinations(diceToTest).length;
		if (testResult){
			return false;
		} else {
			return true;
		}
		return true;
	},
	isValidSelection : function(dice){
	}
}