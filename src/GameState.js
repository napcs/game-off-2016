import Player from './objects/Player';
import ChaserGroup from './groups/ChaserGroup';

let cursors = {};
let keyboardControls = {};
let center = {};

let stage = {};
let player = {};
let chaserGroup = {};
let currentLevel = {};
let fixers = {};
let score = 0;
let scoreLabel = '';
let nextEnemyAt = 0;

class GameState extends Phaser.State {

  preload() {
    this.load.image('chaser', 'assets/sprites/chaser.png');
    this.load.image('fixer', 'assets/sprites/fixer.png');
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('background', 'assets/sprites/background.png');

    this.load.audio('weapon', 'assets/sounds/weapon.wav');
    this.load.audio('hit', 'assets/sounds/hit.wav');
    this.load.audio('kill', 'assets/sounds/kill.wav');
    this.load.audio('death', 'assets/sounds/death.wav');
    this.load.audio('level1', ['assets/music/level1.mp3', 'assets/music/level1.ogg']);
  }

  create() {
    this.music = this.add.audio('level1');
    this.music.play();
    this.add.tileSprite(0, 0, 1000, 600, 'background');
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    cursors = this.input.keyboard.createCursorKeys();
    keyboardControls = {
      up: this.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.input.keyboard.addKey(Phaser.Keyboard.D),
      rotateLeft: this.input.keyboard.addKey(Phaser.Keyboard.J),
      rotateRight: this.input.keyboard.addKey(Phaser.Keyboard.K),
      fire: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };

    this.game.soundEffects = {
      weaponSound: this.add.audio('weapon'),
      hitSound: this.add.audio('hit'),
      killSound: this.add.audio('kill'),
      deathSound: this.add.audio('death')
    };

    stage.backgroundColor = '#BDC2C5';
    player = new Player(this.game).load();
    center = { x: this.game.world.centerX, y: this.game.world.centerY }

    currentLevel = this.calculateLevel();
    const scoreStyle = { font: "16px Arial", fill: "#ff0044", align: "center" };
    scoreLabel = this.add.text(0, 0, "Score: ", scoreStyle);
    score = this.add.text(50, 0, "0", scoreStyle);

    chaserGroup = new ChaserGroup(this.game).load();
  }

  calculateLevel() {
    let speed = 10 + (player.getLevel() * 10);
    let delay = 1000 - (player.getLevel() * 10);

    // don't drop below a sensible floor.
    if (delay < 100) delay = 100;

    return {
      enemyDelay: delay,
      enemySpeed: speed
    }
  }

  enemyHitsPlayer(player, enemy) {
    player.kill();

    this.game.soundEffects.deathSound.play();

    this.music.stop();
		//this.state.start('GameOverState');
		console.debug('died');
  }

  playerShootsEnemy(bullet, enemy) {
    enemy.health--;
    if(enemy.health === 0){
      enemy.kill();
      player.addExp(1); // TODO: get from enemy?
      score.text = player.getExp();
      this.game.soundEffects.killSound.play();
    }else{
      this.game.soundEffects.hitSound.play();
    }

    bullet.kill();
  }

  update() {
    player.move(keyboardControls, cursors);
    this.game.physics.arcade.overlap(chaserGroup.getChasers(), player, this.enemyHitsPlayer, null, this);
    this.game.physics.arcade.overlap(player.getWeapon().bullets, chaserGroup.getChasers(), this.playerShootsEnemy, null, this);
    chaserGroup.spawnChasers(currentLevel.enemyDelay, player);
    chaserGroup.chase(player, currentLevel.enemySpeed);
  }

}

export default GameState;