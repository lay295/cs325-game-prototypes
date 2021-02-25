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

var orientation = 0.0;
var boxGroup;
var frameCount = 0;
var score = 0;
var computer = false;
var cursors;

class Game extends Phaser.Scene {
    
    constructor() {
        super({key: 'Game'});
    }
    
    preload() {

    }
    
    create() {
		score = 0;
		this.platform = this.matter.add.image(400, 900, 'platform', null, { isStatic: true });
		this.platform.setFriction(0.95);
		this.debug = this.add.text(0, 0, '', { font: '32px Courier', fill: '#00ff00' });
		this.scoretext = this.add.text(0, 32, '', { font: '32px Courier', fill: '#00ff00' });
		cursors = this.input.keyboard.createCursorKeys();
		
		var config = {
			classType: Phaser.Physics.Matter.Sprite,
			defaultKey: null,
			defaultFrame: null,
			active: true,
			maxSize: -1,
			runChildUpdate: false,
			createCallback: null,
			removeCallback: null,
			createMultipleCallback: null
		};
		
		boxGroup = this.add.group(config);
    }
    
    update() {
		if (frameCount % (30 * 5) == 0) {
			let newblock = this.matter.add.image(Phaser.Math.Between(100, 700), 50, 'block');
			newblock.setFriction(0.95);
			boxGroup.add(newblock);
			console.log(boxGroup);
		}
		if (frameCount% 30 == 0) {
			score++;
		}
		
		if (cursors.left.isDown)
		{
			orientation = -20;
			computer = true;
		}
		else if (cursors.right.isDown)
		{
			orientation = 20;
			computer = true;
		}
		else if (computer)
		{
			orientation = 0;
		}
		
		this.platform.x += orientation * 0.2;
		this.platform.setVelocityX(orientation * 0.2);
		
		this.debug.setText([
            'Orientation: ' + orientation
        ]);
		
		this.scoretext.setText([
            'Score: ' + score
        ]);
		
		for (var i = 0; i < boxGroup.children.entries.length; i++) {
			if (boxGroup.children.entries[i].y > 1100) {
				//Game Over
				console.log("game over");
				this.scene.start('GameOver');
			}
		}

		frameCount++;
    }
}

class GameOver extends Phaser.Scene {
    
    constructor() {
        super({key: 'GameOver'});
    }
    
    preload() {

    }
    
    create() {
		this.add.text(120, 400, 'Game Over - Click to restart', { font: '32px Courier', fill: '#00ff00' });
		this.add.text(300, 500, 'Score: ' + score, { font: '32px Courier', fill: '#00ff00' });
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
		this.load.image('block', 'assets/block.png');
		this.load.image('platform', 'assets/platform.png');
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
		this.add.text(160, 50, 'Tilt Stacker!', { font: '64px Courier', fill: '#00ff00' });
		this.add.text(110, 120, '(Meant to be played on a phone)', { font: '32px Courier', fill: '#00ff00' });

        var container = this.add.container(400, 300, [ bg, text ]);
		
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

window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
	orientation = event.gamma;
	console.log(event);
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 1000,
    scene: [Preload, MainMenu, Game, GameOver],
	backgroundColor: '#1b1464',
	fps: {
		target: 30,
		forceSetTimeOut: true
	},
    physics: { default: 'matter', matter: { gravity: { y: 0.2 } } }
});