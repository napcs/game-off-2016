import Chaser from '../objects/Chaser';

let chasers = {};
let nextEnemyAt = 0;

class ChaserGroup extends Phaser.Group {

  constructor(game) {
    super(game);
  }

  load() {
    chasers = this.game.add.group();
    chasers.enableBody = true;

    chasers = this.game.add.group();
    chasers.enableBody = true;


    for(let i = 0; i < 10; i++) {
      chasers.add( new Chaser(this.game ));
    }

    chasers.setAll('outOfBoundsKill', true);
    chasers.setAll('checkWorldBounds', true);

    return this;
  }

  getChasers() {
    return chasers;
  }

  spawnChasers(enemyDelay, player) {
    if (nextEnemyAt < this.game.time.now ) {
      nextEnemyAt = this.game.time.now + enemyDelay;
      let enemy = chasers.getFirstExists(false);

      // what if there's no enemy?
      if(enemy) {

        // spawn at a random location
        let enemyX = this.game.rnd.integerInRange(20, this.game.world.width)
        let enemyY = this.game.rnd.integerInRange(20, this.game.world.height)

        let willCollide = Phaser.Rectangle.intersectsRaw(player.getBounds(), enemyX, enemyX + enemy.width, enemyY, enemyY + enemy.height, 200);


        if (willCollide) {
          if(enemyX < player.x) {
            enemyX-= 100;
          } else {
            enemyX+= 100;
          }
        }

        enemy.spawn(enemyX, enemyY);
      }

    }
  }

  chase() {
    /*
    for(let i = 0, length = chasers.length; i < length; i++ ){
      let enemy = chasers.children[i];
      this.game.physics.arcade.moveToObject(enemy, this.game.player, gameState.currentLevel.enemySpeed);
      enemy.rotation = Math.atan2(this.game.player.y - enemy.y, this.game.player.x - enemy.x);
    }  
    */
  }

}

export default ChaserGroup;