class Enemy extends Phaser.Sprite {
  constructor(game, x, y, key) {
    super(game, x, y, key); // Setup Phaser.Sprite. It's coordinates is unimportant and I just set them to zero. "Sprites" is a spriteatlas with sprites for all enemies.
    this.exists = false; // I create an enemy instance but don't want to add it to the stage. For this I use a spawn method (mainly to make it easier to reuse the enemies from it's type specific pool).
    this.game.physics.enable(this);
  }

  spawn(x,y) {
    this.reset(x, y);
    this.health = this.maxHealth;
  }
}
export default Enemy;
