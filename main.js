var mainState = {
	preload: function() {

		game.load.image('dog', 'assets/dog.png');
		game.load.image('rock', 'assets/rock.png');
		game.load.audio('jump', 'assets/jump.wav');

	},

	create: function() {

		this.jumpSound = game.add.audio('jump');

		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", 
    		{ font: "30px Arial", fill: "#ffffff" });   

		this.rocks = game.add.group();

		this.timer = game.time.events.loop(1500, this.addRowOfRocks, this);

		game.stage.backgroundColor = '#71c5cf';

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.dog = game.add.sprite(100, 245, 'dog');

		game.physics.arcade.enable(this.dog);

		this.dog.body.gravity.y = 1000;

		this.dog.anchor.setTo(-0.2, 0.5);

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

	},

	update: function() {

		if (this.dog.angle < 20)
    		this.dog.angle += 1; 

		if (this.dog.y < 0 || this.dog.y > 490)
			this.restartGame();

		game.physics.arcade.overlap(
    		this.dog, this.rocks, this.hitRock, null, this);

	},

	jump: function() {

		this.jumpSound.play();

		if (this.dog.alive == false)
			return;

		this.dog.body.velocity.y = -350;

		var animation = game.add.tween(this.dog);

		animation.to({angle: -20}, 100);

		animation.start();
	},

	addOneRock: function(x, y) {
		var rock = game.add.sprite(x, y, 'rock');

		this.rocks.add(rock);

		game.physics.arcade.enable(rock);

		rock.body.velocity.x = -200;

		rock.checkWorldBounds = true;
		rock.outOfBoundsKill = true;
	},

	addRowOfRocks: function() {
		var hole = Math.floor(Math.random() * 5) + 1;

		for (var i = 0; i < 8; i++)
			if (i != hole && i != hole + 1)
				this.addOneRock(400, i * 60 + 10);

		this.score += 1;
		this.labelScore.text = this.score;

	},

	hitRock: function() {

		if (this.dog.alive == false)
			return;

		this.dog.alive = false;

		game.time.events.remove(this.timer);

		this.rocks.forEach(function(r) {
			r.body.velocity.x = 0;
		}, this);
	},

	restartGame: function() {

		game.state.start('main');
	},

};

var game = new Phaser.Game(400, 490);

game.state.add('main', mainState);

game.state.start('main');