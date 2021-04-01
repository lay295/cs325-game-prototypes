import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var score = 0;
var time = 30;
var scene;
var goal;
var balls = new Array()

class Game extends Phaser.Scene {
    
    constructor() {
        super({key: 'Game'});
    }
    
    preload() {

    }
    
    create() {
		scene = this
		SpawnBall()
		score = 0
		time = 30

		goal = scene.physics.add.sprite(500, 100, 'goal');
		goal.setVelocity(200, 0);
		goal.setBounce(1).setCollideWorldBounds(true);

		this.scoretext = this.add.text(0, 0, '', { font: '32px Courier', fill: '#00ff00' });
		this.time = this.add.text(0, 32, '', { font: '32px Courier', fill: '#00ff00' });
		this.scoretext.setText([
            'Score: ' + score
        ]);
		this.time.setText([
            'Time: ' + time
        ]);
		var timer = window.setInterval(function(){
			time--
			scene.time.setText([
				'Time: ' + time
			]);

			if (time == -1) {
				clearInterval(timer)
				scene.scene.start('GameOver');
			}
		}, 1000);
		setTimeout(function () {
			goal.setVelocity(-300, 0);
		}, 10000)
		setTimeout(function () {
			goal.setVelocity(-500, 0);
		}, 20000)
    }
    
    update() {
		balls.forEach(function (item, index) {
			if (item.y > 70 && item.y < 130) {
				if (item.x > goal.x - 100 && item.x < goal.x + 100) {
					console.log('GOAL')
					item.destroy()
					score++
					balls.splice(index, 1)
					scene.scoretext.setText([
						'Score: ' + score
					]);
				}
			}

			if (item.y < -200) {
				item.destroy()
				balls.splice(index, 1)
			}
		});
    }
}

function SpawnBall() {
	var ball = scene.physics.add.sprite(500, 600, 'ball');
	balls.push(ball)
	ball.setInteractive();
	scene.input.setDraggable(ball);
	ball.shot = false
	scene.input.on('drag', OnDrag);
	scene.input.on('dragend', OnDragEnd);
}

function OnDrag(pointer, gameObject, dragX, dragY) {
	if (gameObject.shot == false) {
		gameObject.x = dragX;
		if (dragY < 600)
			gameObject.y = 600;
		else
			gameObject.y = dragY;
	}
}

function OnDragEnd(pointer, gameObject, dragX, dragY) {

	console.log('Drag end');
	if (gameObject.shot == false) {
		let angle = Phaser.Math.Angle.Between(gameObject.x, gameObject.y, 500, 590)
		let distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, 500, 590)
		console.log(distance)
		const x = Math.cos(angle) * distance * 8
		const y = Math.sin(angle) * distance * 8
		gameObject.setVelocity(x, y)
		console.log(x + ',' + y);
		gameObject.shot = true

		setTimeout(function () {
			SpawnBall()
		}, 1000)
	}
}

class GameOver extends Phaser.Scene {
    
    constructor() {
        super({key: 'GameOver'});
    }
    
    preload() {

    }
    
    create() {
		this.add.text(220, 300, 'Game Over - Click to restart', { font: '32px Courier', fill: '#00ff00' });
		this.add.text(400, 400, 'Score: ' + score, { font: '32px Courier', fill: '#00ff00' });
        this.input.once('pointerup', function (event) {
            this.scene.start('Game');
        }, this);
    }
    
    update() {
		
    }
}

class Preload extends Phaser.Scene {
    
    constructor() {
        super({key: 'Preload'});
    }
    
    preload() {
		this.load.image('ball', 'assets/ball.png');
		this.load.image('goal', 'assets/goal.png');
		this.load.image('buttonBG', 'assets/button-bg.png');
        this.load.image('buttonText', 'assets/button-text.png');
		this.load.audio('music', 'assets/music.mp3');
    }
    
    create() {
		this.scene.start('MainMenu');
    }
    
    update() {
		
    }
}

class MainMenu extends Phaser.Scene {
    
    constructor() {
        super({key: 'MainMenu'});
    }
    
    preload() {
		
    }
    
    create() {
		var bg = this.add.image(0, 0, 'buttonBG');
        var text = this.add.image(0, 0, 'buttonText');
		this.add.text(140, 50, 'Paper Goal Shooter!', { font: '64px Courier', fill: '#00ff00' });

        var container = this.add.container(500, 200, [ bg, text ]);
		
		this.music = this.sound.add( 'music' );
        this.music.setLoop(true);
        this.music.play();

        bg.setInteractive();

        bg.once('pointerup', function () {
            this.scene.start('Game');
        }, this);
    }
    
    update() {
		
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    height: 800,
    scene: [Preload, MainMenu, Game, GameOver],
	backgroundColor: '#1b1464',
	fps: {
		target: 30,
		forceSetTimeOut: true
	},
    physics: { default: 'arcade' }
});