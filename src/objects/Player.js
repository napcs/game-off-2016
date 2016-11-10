import box from '../utils/box';

const SPRITE_SHEET = 'player';
const INITIAL_SPEED = 250;

let pos_x        = 0;
let pos_y        = 0;
let speed        = 0;

let playerLevel  = 1;
let playerXP     = 0;
let weapon       = {};

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

    this.defineWeapons();
    return this;
  }

  defineWeapons() {
    weapon = this.game.add.weapon(30,
      box(this.game, {length: 6, width: 6, color: '#f00'})
    );

    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 600;
    weapon.trackSprite(this, 0, 0, true);

  }

  addExp(amount) {
    playerXP += amount;
  }

  getExp() {
    return playerXP;
  }

  getLevel() {
    return playerLevel;
  }

  getWeapon() {
    return weapon;
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
      weapon.fire();
      this.game.soundEffects.weaponSound.play();
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