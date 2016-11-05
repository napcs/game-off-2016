import box from './utils/box';
class GameState extends Phaser.State {

  definePlayer () {
    this.player = this.add.sprite(this.center.x, this.center.y,
      box(this.game, {length: 32, width: 32, color: '#4F616E'})
    );

    this.player.body.collideWorldBounds = true;

    this.player.anchor.set(0.5);
    this.player.speed = 250;
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

	create() {

    this.levels = [
      {enemyDelay: 500, enemySpeed: 30 }
    ]

    this.currentLevel = this.levels[0];

    this.stage.backgroundColor = '#BDC2C5';
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

		this.center = { x: this.world.centerX, y: this.game.world.centerY }

    let scoreStyle = { font: "16px Arial", fill: "#ff0044", align: "center" };
    let score = this.add.text(0, 0, "0", scoreStyle);


    this.definePlayer();
    this.defineEnemies();
    this.defineKeys();
    this.defineWeapons();

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
  }

  handleEnemies() {


    if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.currentLevel.enemyDelay;
      var enemy = this.enemies.getFirstExists(false);
      // spawn at a random location
      //
      let enemyX = this.rnd.integerInRange(20, 480) + this.player.x + 50;
      let enemyY = this.rnd.integerInRange(20, 480) + this.player.y + 50;

      enemy.reset(enemyX, enemyY);

 //      enemy.body.velocity.x = this.currentLevel.enemySpeed;
  //    enemy.body.velocity.y = this.currentLevel.enemySpeed;


    }



      // hurl enemy at player
      for(let i = 0, length = this.enemies.length; i < length; i++ ){
        let enemy = this.enemies.children[i];
        this.physics.arcade.moveToObject(enemy, this.player, 50);
      }

  }

}

export default GameState;
