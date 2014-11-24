test = {
	makeDice : function(diceList, state) {
		dice = []
		var die;
		for (var i=0; i<diceList.length; i++){
			die = {
				val : diceList[i],
				id  : i,
				state: state
			};
			dice.push(die);
		}
		return dice;
	},
	sixDice : function() {
		var straight = this.makeDice([2,3,1,5,6,4], 'fresh');
		var threePair= this.makeDice([2,5,5,3,3,2], 'selected');
		var sixKind  = this.makeDice([2,2,2,2,2,2], 'held');
		var sixOnes  = this.makeDice([1,1,1,1,1,1], 'locked');
		var handScores = [
			[straight, 1000],
			[threePair, 750],
			[sixKind, 1250],
			[sixOnes, 2000]
		];

		var test, hand, points
		for (var i=0; i<handScores.length; i++) {
			test = handScores[i];
			hand = test[0];
			points = test[1];
			if (logic.getSixDieScore(hand) != points) {
				console.log("Error!");
			}
		}
	},
	threeDice : function() {
		var threeTwos = this.makeDice([2,2,2], 'held');
		var threeOnes = this.makeDice([1,1,1], 'locked');
		var nothing = this.makeDice([4,3,6], 'held');
		var oneOne = this.makeDice([4,1,6], 'held');
		var handScores = [
			[threeTwos, 200],
			[threeOnes, 1000],
			[nothing, 0],
			[oneOne, 0]
		];
		var test, hand, points
		for (var i=0; i<handScores.length; i++) {
			test = handScores[i];
			hand = test[0];
			points = test[1];
			if (logic.getThreeDieScore(hand) != points) {
				console.log("Error!");
			}
		}
	}
}