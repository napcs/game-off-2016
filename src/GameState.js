import box from './utils/box';

import Fixer from './enemies/Fixer';
import Chaser from './enemies/Chaser';

class GameState extends Phaser.State {
  preload() {
    this.load.image('chaser', 'assets/sprites/chaser.png');
    this.load.image('fixer', 'assets/sprites/fixer.png');
  }

  definePlayer () {
    this.player = this.add.sprite(this.center.x, this.center.y,
      box(this.game, {length: 32, width: 32, color: '#4F616E'})
    );

    this.player.body.collideWorldBounds = true;

    this.player.anchor.set(0.5);
    this.player.speed = 250;

    this.playerLevel = 1;
    this.playerXP = 0;
  }

  defineEnemies () {
    this.chasers = this.add.group();
    this.chasers.enableBody = true;

    this.nextEnemyAt = 0;

    for(let i = 0; i < 10; i++) {
      this.chasers.add( new Chaser(this.game ));
    }

    this.chasers.setAll('outOfBoundsKill', true);
    this.chasers.setAll('checkWorldBounds', true);

    this.fixers = this.add.group();
    this.fixers.enableBody = true;

    for(let i = 0; i < 10; i++) {
      this.fixers.add( new Fixer(this.game ));
    }

    this.fixers.setAll('outOfBoundsKill', true);
    this.fixers.setAll('checkWorldBounds', true);
  }

  defineKeys() {
    this.cursor = this.input.keyboard.createCursorKeys();

    this.keyboardControls = {
      up: this.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.input.keyboard.addKey(Phaser.Keyboard.D),
      rotateLeft: this.input.keyboard.addKey(Phaser.Keyboard.J),
      rotateRight: this.input.keyboard.addKey(Phaser.Keyboard.K),
      fire: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };
  }

  defineWeapons() {
    this.weapon = this.add.weapon(30,
      box(this.game, {length: 6, width: 6, color: '#f00'})
    );

    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletSpeed = 600;
    this.weapon.trackSprite(this.player, 0, 0, true);
  }

  // Determines level based on current player XP
  calculateLevel() {
    let speed = 10 + (this.playerLevel * 10);
    let delay = 1000 - (this.playerLevel * 10);

    // don't drop below a sensible floor.
    if (delay < 100) delay = 100;

    return {
      enemyDelay: delay,
      enemySpeed: speed
    }
  }

  levelUpPlayer() {
    let step = 5;
    this.playerLevel = Math.floor(Math.log(this.playerXP + 1, step));
  }

	create() {

    this.stage.backgroundColor = '#BDC2C5';
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

		this.center = { x: this.world.centerX, y: this.game.world.centerY }

    let scoreStyle = { font: "16px Arial", fill: "#ff0044", align: "center" };
    this.score = this.add.text(0, 0, "0", scoreStyle);

    this.definePlayer();
    this.defineEnemies();
    this.defineKeys();
    this.defineWeapons();

    // starting level
    this.currentLevel = this.calculateLevel();
	}

  handlePlayerMovement() {

    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    if (this.keyboardControls.rotateRight.isDown) {
      this.player.body.angularVelocity = 100;
    }else if (this.keyboardControls.rotateLeft.isDown) {
      this.player.body.angularVelocity = -100;
    }else{
      this.player.body.angularVelocity = 0;
    }

    if (this.keyboardControls.fire.isDown) {
      this.weapon.fire();
    }

    if (this.cursor.up.isDown || this.keyboardControls.up.isDown ) {
      this.player.body.velocity.y -= this.player.speed;
    } else if (this.cursor.down.isDown || this.keyboardControls.down.isDown) {
      this.player.body.velocity.y += this.player.speed;
    }

    if (this.cursor.left.isDown || this.keyboardControls.left.isDown) {
      this.player.body.velocity.x -= this.player.speed;
    } else if (this.cursor.right.isDown || this.keyboardControls.right.isDown) {
      this.player.body.velocity.x += this.player.speed;
    }
  }

  playerShootsEnemy(bullet, enemy) {
    enemy.health--;
    if(enemy.health === 0){
      enemy.kill();
      this.playerXP += 1; // TODO: get from enemy?
      this.score.text = this.playerXP;
    }
    bullet.kill();
  }

  enemyHitsPlayer(player, enemy) {
    player.kill();
		this.state.start('GameOverState');
  }

  update() {
    //  Run collision
    this.game.physics.arcade.overlap(this.weapon.bullets, this.chasers, this.playerShootsEnemy, null, this);
    this.game.physics.arcade.overlap(this.weapon.bullets, this.fixers, this.playerShootsEnemy, null, this);
    this.game.physics.arcade.overlap(this.chasers, this.player, this.enemyHitsPlayer, null, this);
    this.game.physics.arcade.overlap(this.fixers, this.player, this.enemyHitsPlayer, null, this);

    this.handlePlayerMovement();
    this.handleEnemies();

    this.levelUpPlayer();
    this.currentLevel = this.calculateLevel();
  }

  render() {
    this.game.debug.start(20, 20, 'black');
    this.game.debug.line();
    this.game.debug.line('player xp: ' + this.playerXP);
    this.game.debug.line('current level: ' + this.playerLevel);
    this.game.debug.line('Enemy speed: ' + this.currentLevel.enemySpeed);
    this.game.debug.line('Enemy delay: ' + this.currentLevel.enemyDelay);
    this.game.debug.stop();
  }

  handleEnemies() {

    if (this.nextEnemyAt < this.time.now ) {
      this.nextEnemyAt = this.time.now + this.currentLevel.enemyDelay;

      if (this.rnd.integerInRange(1,2) % 2 === 0) {
        var enemy = this.chasers.getFirstExists(false);
      } else {
        var enemy = this.fixers.getFirstExists(false);
      }

      // what if there's no enemy?
      if(enemy) {

        // spawn at a random location
        let enemyX = this.rnd.integerInRange(20, 480)
        let enemyY = this.rnd.integerInRange(20, 480)

        /* adjust for player */
        let willCollide = Phaser.Rectangle.intersectsRaw(this.player.getBounds(), enemyX, enemyX + enemy.width, enemyY, enemyY + enemy.height, 200);

        console.log(willCollide);

        if (willCollide) {
          if(enemyX < this.player.x) {
            enemyX-= 100;
          } else {
            enemyX+= 100;
          }
        }

        enemy.spawn(enemyX, enemyY);
      }

    }

    // hurl chasers at player
    for(let i = 0, length = this.chasers.length; i < length; i++ ){
      let enemy = this.chasers.children[i];
      this.physics.arcade.moveToObject(enemy, this.player, this.currentLevel.enemySpeed);
      enemy.rotation = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
    }

  }

}

export default GameState;
