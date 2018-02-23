module PhaserGame.Client {

	export class MainMenu extends Phaser.State {
    private mainDummy: Phaser.Sprite;
    private btnHorField: NSBtn;
    private btnVertField: NSBtn;
    private btnHor2Field: NSBtn;

		create() {
			// just container for some elements
			this.mainDummy = new Phaser.Sprite(this.game, 0, 0);
			this.add.existing(this.mainDummy);

			this.btnHorField = new NSBtn(this.game, Config.GW / 2, Config.GH / 2, 
				this.onHorizFieldClick, this, 200, 50, 'Horiz Field');
      this.btnHorField.anchor.set(0.5);
      this.mainDummy.addChild(this.btnHorField);

      this.btnVertField = new NSBtn(this.game, Config.GW / 2, Config.GH / 2 + 90,
        this.onVertFieldClick, this, 200, 50, 'Vertical Field');
      this.btnVertField.anchor.set(0.5);
      this.mainDummy.addChild(this.btnVertField);

      this.btnHor2Field = new NSBtn(this.game, Config.GW / 2, Config.GH / 2 + 90 * 2,
        this.onHoriz2FieldClick, this, 200, 50, 'Horiz 2 Field');
      this.btnHor2Field.anchor.set(0.5);
      this.mainDummy.addChild(this.btnHor2Field);
		}

		private onHorizFieldClick() {
      this.game.state.start(States.HEX_HOR_MENU, true, false);
    }
    
    private onVertFieldClick() {
      this.game.state.start(States.HEX_VERT_MENU, true, false);
    }

    private onHoriz2FieldClick() {
      this.game.state.start(States.HEX_HOR2_MENU, true, false);
    }

		update() {
			var dt = this.game.time.elapsed * 0.001;

		}

	}

}