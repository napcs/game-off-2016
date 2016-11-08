import TitleState from './TitleState';
import GameState from './GameState';
import GameOverState from './GameOverState';

class Game extends Phaser.Game {

	constructor() {
		super(720, 480, Phaser.AUTO, 'content', null);
		this.state.add('TitleState', TitleState, false);
		this.state.add('GameState', GameState, false);
		this.state.add('GameOverState', GameOverState, false);
		this.state.start('TitleState');
	}

}

new Game();
