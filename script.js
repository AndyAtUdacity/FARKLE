var model, view, octopus, update, turn;
$('document').ready(function(){
	turn = {
		state: 'new',
		states: ['new', 'rolling', 'just-rolled', 'busted', 'selecting', 'scoring', 'refreshed'],
		playerIndex: 0,
		nextPlayerIndex: function() {
			return (turn.playerIndex + 1) % model.numPlayers;
		}
	};
	model = {
		playerScore : 0,
		numPlayers: 1,
		turnScore : 0,
		rollScore : 0,
		canRoll : function() {
			var state = turn.state;
			var falseStates = ['busted', 'just-rolled', 'just-rolled-first', 'selected-bad']
			if (falseStates.indexOf(state) > -1){
				return false;
			};
			var trueStates = ['new', 'refreshed', 'selected-good'];
			if (trueStates.indexOf(state) > -1) {
				return true;
			}
			console.log(turn.state);
			return true;
		},
		canEndTurn: function(){
			var state = turn.state;
			var falseStates = ['busted', 'new', 'just-rolled-first', 'selected-bad'];
			if (falseStates.indexOf(state) > -1){
				return false;
			};
			var trueStates = ['refreshed', 'selected-good', 'just-rolled'];
			if (trueStates.indexOf(state) > -1) {
				return true;
			}
			if (model.turnScore > 0) {
				return true;
			} else {
				return false;
			}
			console.log(state);
			return true;
		},
		dice : [],
		setDie : function(newDie){
			this.val = newDie.val;
			this.state = newDie.state;
		},
		getDiceOfState : function(state){
			var diceToReturn = []
			var die;
			for (var i=0; i<this.dice.length; i++){
				die = this.dice[i];
				if (die.state == state){
					diceToReturn.push(die);
				}
			}
			return diceToReturn;
		},
		refreshDice : function() {
			var die;
			for (var i=0; i<model.dice.length; i++) {
				die = model.dice[i];
				die.state = 'fresh';
				die.val = '?';
			}
		},
		getAllDice : function(){
			return this.dice;
		},
		initialize : function(){
			for (var i=0; i<6; i++){
				this.dice.push({
					val : '?',
					id  : i,
					state: 'fresh'
				});
			};
		},
		allDiceUsed : function(){
			var die;
			var usedDice = []
			for (var i=0; i<model.dice.length; i++){
				die = model.dice[i];
				if (die.state != 'locked' && die.state != 'selected'){
					return false;
				}
			};
			return true;
		}
	}
	view = {
		diceContainer : $('div.dice-container'),
		dice : function(){
			return $(this.diceContainer).children()
		},
		initialize : function() {
			var die;
			for (var i=0; i<octopus.getAllDice().length; i++){
				die = octopus.getDie(i);
				var toAppend = '<div class="die die-'+die.state+'" id="die-'+die.id+'">'+die.val+'</div>';
				$(this.diceContainer).append(toAppend);
			}
			view.render();
		},
		renderDice : function(){
			var die;
			for (var i=0; i<octopus.getAllDice().length; i++){
				die = octopus.getDie(i);
				$('#die-'+die.id).attr('class', 'die die-'+die.state);
				$('#die-'+die.id).text(die.val);
			}
		},
		renderScores : function(){
			var scores = octopus.getScores();
			$('#turn-score').text(scores['turnScore']);
			$('#total-score').text(scores['playerScore']);
		},
		renderButtons : function(){
			var actions = octopus.getActions();
			if (actions['canRoll']){
				$('#roll').removeClass('disabled');
				$("#roll").prop("disabled",false);
			} else {
				$('#roll').addClass('disabled');
				$("#roll").prop("disabled",true);
			};
			if (actions['canEndTurn']){
				$('#end-turn').removeClass('disabled')
				$("#end-turn").prop("disabled",false);
			} else {
				$('#end-turn').addClass('disabled');
				$("#end-turn").prop("disabled",true);
			}
		},
		render : function(){
			var actions;
			view.renderDice();
			view.renderScores();
			view.renderButtons();
		}
	}
	octopus = {
		getScores : function() {
			var scores = {
				'turnScore' : model.turnScore,
				'rollScore' : model.rollScore,
				'playerScore':model.playerScore
			}
			return scores;
		},
		getActions : function() {
			return {
				'canRoll' : model.canRoll(),
				'canEndTurn': model.canEndTurn()
			}
		},
		getDie : function(index) {
			return model.dice[index];
		},
		getAllDice: function() {
			return model.dice;
		},
		clickTransition : {
			'fresh' : 'selected',
			'selected' : 'fresh',
			'locked':'locked'
		},
		connectViewToModel: function(){
			$('.die').click(function(){ // TODO : fix this so the jQuery stuff is in view.render()
				var die, selected;
				die = model.dice[$(this).attr('id').slice(-1)];
				$(this).removeClass('die-'+die.state);
				die.state = octopus.clickTransition[die.state];
				$(this).addClass('die-'+die.state);
				$(this).text(die.val);
				selected = model.getDiceOfState('selected');
				if (!selected || selected.length == 0) {
					turn.state = 'selected-bad';
				} else if (logic.scoreDice(selected)){//['score'] > 0) {
					turn.state = 'selected-good';
				} else { //if(selected.length) {
					turn.state = 'selected-bad';
				};
				view.render();
			});
			$('#roll').click(function(){
				var die, combinationsAndScore, combinations, score;
				var selected = [];
				var fresh = [];
				var scoringDice = [];
				for (var i=0; i<model.dice.length; i++){
					die = model.dice[i];
					if (die.state == 'selected') {
						selected.push(die);
					};
					if (die.state == 'fresh') {
						fresh.push(die);
					}
				};
				// if (selected.length == 0 && fresh.length < 6) {
				// 	alert('select some dice before you roll!');
				// 	return;
				// };
				if (selected.length){
					combinationsAndScore = logic.scoreDice(selected);
					combinations = combinationsAndScore['combinations'];
					score = combinationsAndScore['score'];
					model.turnScore += score;
				};
				function rollDiceToState(state) {
					var die;
					for (var i=0; i<model.dice.length; i++){
						die = model.dice[i];
						if (die.state == 'selected'){
							die.state = 'locked';
						}
						if (die.state == 'fresh'){
							die.val = Math.floor(Math.random() * 6) + 1;
						}
						turn.state = state;
					};
				}
				rollDiceToState('just-rolled');
				var dice = [];
				for (var i=0; i<model.dice.length; i++){
					die = model.dice[i];
					if (die.state == 'fresh'){
						dice.push(die);
					}
					if (dice.length == 6) {
						turn.state = 'just-rolled-first';
					}
				};
				view.render();
				if (logic.handDoesBust(dice)){
					alert('Busted!');
					model.turnScore = 0;
					turn.state = 'busting';
					model.refreshDice();
					turn.state = 'new'
				}
				if (model.allDiceUsed()){
					model.refreshDice();
					turn.state = 'refreshed';
					rollDiceToState('refreshed');
				}
				view.render();
			});
			$('#end-turn').click(function(){
				var die;
				var selected = [];
				for (var i=0; i<model.dice.length; i++){
					die = model.dice[i];
					if (die.state == 'selected'){
						selected.push(die);
					}
				}
				model.turnScore += logic.scoreDice(selected)['score'];
				model.playerScore += model.turnScore;
				model.turnScore = 0;
				model.refreshDice();
				view.render();
			});
		}
	}
	update = function(){
		model.update();
		view.render();
		octopus.connectViewToModel();
	}
	model.initialize();
	view.initialize();
	octopus.connectViewToModel();
});

