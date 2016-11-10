import Enemy from './Enemy';

class Chaser extends Enemy {
  constructor(game) {
    super(game, 0,0, "chaser" );
    this.maxHealth = 1;
    this.angle = 270;
  }
}
export default Chaser;
