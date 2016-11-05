class TitleState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }

    let titleStyle = { font: "65px Arial", fill: "#ff0044", align: "center" };
    let subtitleStyle = { font: "20px Arial", fill: "#ff0044", align: "center" };
    let title = this.game.add.text(center.x, center.y, "HACK", titleStyle);
		title.anchor.set(0.5);

    let subtitle = this.game.add.text(center.x, center.y + 100, "Press Enter to Start", subtitleStyle);
		subtitle.anchor.set(0.5);

    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	}

  update() {
   if (this.enterKey.isDown) {

      this.state.start('GameState');

    }
  }

}

export default TitleState;