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

var treeGroup;
var player;
var score = 0;
var text;
var scene;

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
        scene = this;
    }
    
    preload() {
        this.load.image('ship', 'assets/car.png');
        this.load.image('tree', 'assets/props_tree.png');
        this.load.image('stone1', 'assets/props_small_stone.png');
        this.load.image('stone2', 'assets/props_big_stone.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('fire1', 'assets/fire1.png');
        this.load.image('fire2', 'assets/fire2.png');
        this.load.image('fire3', 'assets/fire3.png');
        this.load.image('fire4', 'assets/fire4.png');
        this.load.audio('coin', 'assets/coin.mp3');
    }
    
    create() {
        this.anims.create({
            key: 'fire',
            frames: [
                { key: 'fire1' },
                { key: 'fire2' },
                { key: 'fire3' },
                { key: 'fire4', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        for (var i = 0; i < 24; i++) {
            for (var j = 0; j < 24; j++) {
                this.add.sprite( i * 44, j * 44, 'ground' ).setOrigin(0,0);
            }
        }

        for (var i = 0 ; i < 30; i++) {
            this.add.sprite( Phaser.Math.Between(0, 1024), Phaser.Math.Between(0, 1024), 'stone1' ).setOrigin(0,0);
        }

        for (var i = 0 ; i < 30; i++) {
            this.add.sprite( Phaser.Math.Between(0, 1024), Phaser.Math.Between(0, 1024), 'stone2' ).setOrigin(0,0);
        }

        treeGroup = this.physics.add.staticGroup({
            key: 'tree',
            frameQuantity: 100,
            immovable: true
        });

        var children = treeGroup.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            var x = Phaser.Math.Between(0, 1024);
            var y = Phaser.Math.Between(0, 1024);

            children[i].setPosition(x, y);
        }

        treeGroup.refresh();

        this.cameras.main.setBounds(0, 0, 1024, 1024);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.ship = this.physics.add.image(400.5, 301.3, 'ship');
        this.cameras.main.startFollow(this.ship, true, 0.09, 0.09);
        this.cameras.main.setZoom(2);

        this.physics.add.overlap(this.ship, treeGroup, hitTree);
        player = this.ship;

        children[Phaser.Math.Between(0, children.length)].setTexture('fire1').play('fire');
    }

    update () 
    {
        if (this.cursors.left.isDown)
        {
            this.ship.setAngle(-90);
            this.ship.x -= 1.5;
        }
        else if (this.cursors.right.isDown)
        {
            this.ship.setAngle(90);
            this.ship.x += 1.5;
        }

        if (this.cursors.up.isDown)
        {
            this.ship.setAngle(0);
            this.ship.y -= 1.5;
        }
        else if (this.cursors.down.isDown)
        {
            this.ship.setAngle(-180);
            this.ship.y += 1.5;
        }
    }
}

function hitTree (player, tree) {
    console.log("Hit tree");
    console.log(tree);

    if (tree.texture.key.includes("fire")) {
        tree.anims.stop();
        tree.setTexture('tree');
        score++;
        var children = treeGroup.getChildren();
        children[Phaser.Math.Between(0, children.length)].setTexture('fire1').play('fire');
        scene.sound.play('coin');
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
