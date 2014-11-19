
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
				$(this.diceContainer)[i].attr('class', 'die die-'+die.state);
				$(this.diceContainer)[i].text(die.val);
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
			'fresh' : 'held',
			'held' : 'fresh'
		},
		connectViewToModel: function(){

			console.log(this.clickTransition);
			$(document).delegate(".die", "click", function(){
				var die;
				console.log(this);
				die = model.dice[$(this).attr('id').slice(-1)];
				console.log('this is '+$(this).html());
				$(this).removeClass('die-'+die.state);
				die.state = octopus.clickTransition[die.state];
				$(this).addClass('die-'+die.state);
				// $(this).attr('class','die die-'+die.state);
				// $(this).attr('id', 'die-'+die.id);
				// $(this).text(die.val);

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
	// setInterval(function(){
	// 	update()
	// }, 500)

	// rollTransition = {
	// 	'held' : roll
	// };
	// $('div.die').click(function(){
	// 	var die;
	// 	die = model.dice[$(this).attr('id').slice(-1)];
	// 	console.log('this is '+this);
	// 	die.state = clickTransition[die.state];
	// 	$(this).attr('class','die die-'+die.state);
	// });
	// $('#roll').click(function(){
	// 	for (var i=0; i<model.dice.length; i++){
	// 		var die;
	// 		die = model.dice[i];
	// 		die.state = rollTransition[die.state];
	// 		$(this).attr('class','die die-'+die.state);
	// 	}
	// });
});

