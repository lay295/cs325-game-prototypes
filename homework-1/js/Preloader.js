export class Preloader extends Phaser.Scene {

    constructor() {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super( 'Preloader' );
        
        this.progressBox = null;
        this.progressBar = null;
        
        this.ready = false;
    }

    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', function (value) {
            console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        this.load.image('play', 'assets/play.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('background', 'assets/parallax-mountain-bg.png');
        this.load.image('background-4', 'assets/parallax-mountain-montain-far.png');
        this.load.image('background-3', 'assets/parallax-mountain-mountains.png');
        this.load.image('background-2', 'assets/parallax-mountain-trees.png');
        this.load.image('background-1', 'assets/parallax-mountain-foreground-trees.png');
        this.load.image('cat', 'assets/cat.png');
        this.load.image('cat_top', 'assets/cat_top.png');
        this.load.image('cat_middle', 'assets/cat_middle.png');
        this.load.image('cat_bottom', 'assets/cat_bottom.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('platform_small', 'assets/platform_small.png');
        this.load.audio('death', 'assets/dead.mp3');
        this.load.audio('meow', 'assets/meow.mp3');
        this.load.audio('music', 'assets/music.mp3');
    }

    create() {
        
    }

    update() {
        //	You don't actually need to do this, but I find it gives a much smoother game experience.
        //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
        //	You can jump right into the menu if you want and still play the music, but you'll have a few
        //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
        //	it's best to wait for it to decode here first, then carry on.
        
        //	If you don't have any music in your game then put the `this.scene.start()` call in the `create` function and delete
        //	the `update()` function completely.
        
        if( /* this.cache.isSoundDecoded('titleMusic') && */ this.ready === false )
        {
            this.ready = true;
            this.scene.start('MainMenu');
        }
    }

}
