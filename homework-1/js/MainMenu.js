import {Button} from './Button.js';

var background1;
var background2;
var background3;
var background4;

export class MainMenu extends Phaser.Scene {

    constructor () {
        super( 'MainMenu' );
        
        this.music = null;
	    this.playButton = null;
	}
    
    create() {
        this.add.sprite( 0, 0, 'background' ).setOrigin(0,0);
        background4 = this.add.sprite( -800, 20, 'background-4' ).setOrigin(0,0);
        background3 = this.add.sprite( -1088, 180, 'background-3' ).setOrigin(0,0);
        background2 = this.add.sprite( -1088, 180, 'background-2' ).setOrigin(0,0);
        background1 = this.add.sprite( -1088, 180, 'background-1' ).setOrigin(0,0);
        this.add.sprite( 140, 170, 'title' ).setOrigin(0,0);

        this.music = this.sound.add( 'music' );
        this.music.setLoop(true);
        this.music.play();
        
        this.playButton = new Button( this, 400, 300, 'play', this.startGame, this, 'over', 'out', 'down' );
    }

    update() {
        background4.x += 0.03;
        background3.x += 0.08;
        background2.x += 0.18;
        background1.x += 0.25;
        if (background4.x >= 0)
            background4.x = -800;
        if (background3.x >= 0)
            background3.x = -1088;
        if (background2.x >= 0)
            background2.x = -1088;
        if (background1.x >= 0)
            background1.x = -1088;
    }
    
    startGame() {
        this.scene.start( 'Game' );
    }
    
}
