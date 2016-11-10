class TitleState extends Phaser.State {

  preload() {
    this.load.audio('intro', ['assets/music/intro.mp3', 'assets/music/intro.ogg']);
  }
	create() {

    this.music = this.add.audio('intro');
    this.music.loop = true;
    this.music.play();
    this.stage.backgroundColor = '#000';
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }

    let titleStyle = { font: "65px Arial", fill: "#ff0044", align: "center" };
    let subtitleStyle = { font: "20px Arial", fill: "#ff0044", align: "center" };
    let title = this.game.add.text(center.x, center.y, "HACK", titleStyle);
		title.anchor.set(0.5);

    let subtitle = this.game.add.text(center.x, center.y + 100, "WASD to move, J and K to rotate, SPACE to shoot\nPress Enter to Start", subtitleStyle);
		subtitle.anchor.set(0.5);

    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	}

  update() {
    if (this.enterKey.isDown) {
      this.music.stop();
      this.state.start('GameState');
    }
  }

}

export default TitleState;
