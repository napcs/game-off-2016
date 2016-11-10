const SPRITE_SHEET = 'player';
const INITIAL_SPEED = 250;

let pos_x        = 0;
let pos_y        = 0;
let speed        = 0;
let playerLevel  = 1;
let playerXP     = 0;

class Player extends Phaser.Sprite {

  constructor(game) {
    super(game, game.world.centerX, game.world.centerY , SPRITE_SHEET);
  }

  load() {
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

    this.anchor.set(0.5);
    speed = INITIAL_SPEED;

    return this;
  }

  move(keyboardControls, cursor) {
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;

    if (keyboardControls.rotateRight.isDown) {
      this.body.angularVelocity = 100;
    }else if (keyboardControls.rotateLeft.isDown) {
      this.body.angularVelocity = -100;
    }else{
      this.body.angularVelocity = 0;
    }

    if (keyboardControls.fire.isDown) {
      //this.weapon.fire();
      //this.weaponSound.play();
    }

    if (cursor.up.isDown || keyboardControls.up.isDown ) {
      this.body.velocity.y -= speed;
    } else if (cursor.down.isDown || keyboardControls.down.isDown) {
      this.body.velocity.y += speed;
    }

    if (cursor.left.isDown || keyboardControls.left.isDown) {
      this.body.velocity.x -= speed;
    } else if (cursor.right.isDown || keyboardControls.right.isDown) {
      this.body.velocity.x += speed;
    }
  }

}

export default Player;