
var model, view, octopus, update;
var gameOn;
$('document').ready(function(){

	gameOn = true;

	model = {
		dice : [],
		getDie : function(i){
			return dice[i];
		},
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
		getAllDice : function(){
			return this.dice;
		},
		initialize : function(){
			for (var i=0; i<6; i++){
				this.dice.push({
					val : Math.floor(Math.random() * 6) + 1,
					id  : i,
					state: 'fresh'
				});
			}
		},
		update : function(){
		}
	}



	view = {
		diceContainer : $('div.dice-container'),
		dice : function(){
			return $(this.diceContainer).children()
		},

		initialize : function() {
			//this.diceContainer.empty();
			var die;
			for (var i=0; i<octopus.getAllDice().length; i++){
				die = octopus.getDie(i);
				var toAppend = '<div class="die die-'+die.state+'" id="die-'+die.id+'">'+die.val+'</div>';
				$(this.diceContainer).append(toAppend);
			}
		},
		render : function(){
			// $(this.diceContainer).empty();
			// this.initialize();
			var die;
			for (var i=0; i<octopus.getAllDice().length; i++){
				die = octopus.getDie(i);
				console.log(die.id);
				$('#die-'+die.id).attr('class', 'die die-'+die.state);
				$('#die-'+die.id).text(die.val);
			}
		},
	}
	octopus = {
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
			$(document).delegate(".die", "click", function(){
				var die;
				die = model.dice[$(this).attr('id').slice(-1)];
				$(this).removeClass('die-'+die.state);
				die.state = octopus.clickTransition[die.state];
				$(this).addClass('die-'+die.state);
				$(this).text(die.val);
			});
			$('#roll').click(function(){
				var die;
				for (var i=0; i<model.dice.length; i++){
					die = model.dice[i];
					if (die.state == 'selected'){
						die.state = 'locked';
					}
					if (die.state == 'fresh')
						die.val = Math.floor(Math.random() * 6) + 1;
				}
				view.render();
			});
			$('#clear').click(function(){
				var die;
				for (var i=0; i<model.dice.length; i++){
					die = model.dice[i];
					if (die.state == 'selected'){
						die.state = 'fresh';
					}
				}
				view.render();
			})
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

