import Enemy from './Enemy';

class Fixer extends Enemy {
  constructor(game) {
    super(game, 0,0, "fixer" );
    this.maxHealth = 5;
  }
}
export default Fixer;
