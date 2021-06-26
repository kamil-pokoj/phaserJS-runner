import Phaser from 'phaser';

class MyGame extends Phaser.Scene
{    
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('sky', './src/assets/sky.png')
        this.load.image('platform', './src/assets/platform.png')
        this.load.image('star', './src/assets/star.png')
        this.load.spritesheet('dude', 
        './src/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
        );


        this.load.text('level', './src/level.json')

}
      
    create ()
    {
        //load background
        this.add.image(400, 300, 'sky');

        //platrom size is statix, x=400, some platform extends beyond level bounds
        let levelData = JSON.parse(this.game.cache.text.get('level'));
        platforms = this.physics.add.staticGroup();  
        platforms.enableBody = true;

        platforms.create(400, 588, 'platform').setScale(2,1).refreshBody();

        levelData.platformData.forEach(function(element){
            platforms.create(element.x, element.y, 'platform');
        }, this);

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        stars.children.iterate(function (child) {
        
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });

        player = this.physics.add.sprite(100, 530, 'dude');

        player.setBounce(0.2);
        player.body.setGravityY(300)
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })


                
    }

    update ()
    {
        this.physics.add.collider(player, ground);
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, ground);
        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(player, stars, collectStar, null, this);




        if (cursors.left.isDown)
            {
                player.setVelocityX(-160);

                player.anims.play('left', true);
            }
            else if (cursors.right.isDown)
            {
                player.setVelocityX(160);

                player.anims.play('right', true);
            }
            else
            {
                player.setVelocityX(0);

                player.anims.play('turn');
            }

            if (cursors.up.isDown && player.body.touching.down)
            {
                player.setVelocityY(-400);
            }

        }
        
        
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: MyGame
};

function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10;
    scoreText.text = 'Score: ' + score
    if (score === 120) {
        alert('You win!')
        score = 0
    }
}

var player;
var ground;
var cursors;
var platforms;
var stars;
var scoreText;
var score = 0;
const game = new Phaser.Game(config);
