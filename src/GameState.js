import box from './utils/box';
class GameState extends Phaser.State {

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
    this.enemies = this.add.group();
    this.enemies.enableBody = true;

    this.nextEnemyAt = 0;

    this.enemies.createMultiple(50,
      box(this.game, {length: 32, width: 32, color: '#f00'})
    );

    this.enemies.setAll('outOfBoundsKill', true);
    this.enemies.setAll('checkWorldBounds', true);
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
    enemy.kill();
    bullet.kill();
    this.playerXP += 1; // TODO: get from enemy?
    this.score.text = this.playerXP;
  }

  enemyHitsPlayer(player, enemy) {
    player.kill();
		this.state.start('GameOverState');
  }

  update() {
    //  Run collision
    this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, this.playerShootsEnemy, null, this);
    this.game.physics.arcade.overlap(this.enemies, this.player, this.enemyHitsPlayer, null, this);

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

    if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.currentLevel.enemyDelay;
      var enemy = this.enemies.getFirstExists(false);

      // spawn at a random location
      let enemyX = this.rnd.integerInRange(20, 480)
      let enemyY = this.rnd.integerInRange(20, 480)

      /* adjust for player */

      let willCollide = Phaser.Rectangle.intersectsRaw(this.player.getBounds(), enemyX, enemyX + enemy.width, enemyY, enemyY + enemy.height, 0);

      if (willCollide) {
        enemyX + 100;
      }

      enemy.reset(enemyX, enemyY);

    }

    // hurl enemy at player
    for(let i = 0, length = this.enemies.length; i < length; i++ ){
      let enemy = this.enemies.children[i];
      this.physics.arcade.moveToObject(enemy, this.player, this.currentLevel.enemySpeed);
    }

  }

}

export default GameState;
