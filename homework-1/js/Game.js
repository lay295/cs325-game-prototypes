var cat = null;
var scene = null;
var done = false;
var platform_small = null;
var count = 0;
var text = null;

export class Game extends Phaser.Scene {

    constructor () {
        super( 'Game' );
        scene = this;
    }
    
    quitGame() {
        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.scene.start( 'MainMenu' );
    }
    
    create() {
        this.add.sprite( 0, 0, 'background' ).setOrigin(0,0);
        this.add.sprite( 20, 450, 'platform' ).setOrigin(0,0);

        text = this.add.text(700, 20, '', { font: '16px Courier', fill: '#00ff00' });
        text.setText([
            'Score: ' + count
        ]);

        scene.input.on('pointerup', function(pointer){
            if (!done)
            {
                done = true;
                cat.angle(90);
                cat.children.entries[0].y = 480;
                cat.children.entries[0].x += cat.children.entries.length-4;
                cat.children.entries[1].y = 480;
                cat.children.entries[1].x -= 45;
                for (var i = 2; i < cat.children.entries.length; i++) {
                    cat.children.entries[i].x = cat.children.entries[1].x + i + 41;
                    cat.children.entries[i].y = 480;
                }
                var grab = cat.children.entries[0].x + 15;

                if (grab > platform_small.x && grab < platform_small.x + 50 ) {
                    console.log("grabbed platform");
                    count++;
                    scene.sound.play('meow');
                    text.setText([
                        'Score: ' + count
                    ]);
                    setTimeout(reset, 1000);
                } else {
                    console.log("missed platform");
                    scene.sound.play('death');
                    setTimeout(function(){ 
                        count = 0;
                        text.setText([
                            'Score: ' + count
                        ]);
                        reset();
                    }, 2000);
                }
            }
         });
        
        reset();
    }

    

    update() {
        var pointer = this.input.activePointer;
        if (pointer.isDown && !done) {
            cat.add(this.add.sprite( cat.children.entries[0].x, cat.children.entries[0].y, 'cat_middle' ).setOrigin(1,1));
            cat.children.entries[0].y -= 1;
        }
    }
}

function reset() {
    if (cat != null) {
        cat.clear(true, true);
        console.log(cat);
    }

    if (platform_small != null) {
        platform_small.destroy();
    }
        

    done = false;

    var config = {
        classType: Phaser.GameObjects.Sprite,
        defaultKey: null,
        defaultFrame: null,
        active: true,
        maxSize: -1,
        runChildUpdate: false,
        createCallback: null,
        removeCallback: null,
        createMultipleCallback: null
    };
    cat = scene.add.group(config);
    cat.add(scene.add.sprite( 130, 405, 'cat_top' ).setOrigin(1,1));
    cat.add(scene.add.sprite( 130, 449, 'cat_bottom' ).setOrigin(1,1));
    cat.add(scene.add.sprite( 130, 406, 'cat_middle' ).setOrigin(1,1));
    platform_small = scene.add.sprite(Math.floor(Math.random() * 500) + 120  , 450, 'platform_small').setOrigin(0,0);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}