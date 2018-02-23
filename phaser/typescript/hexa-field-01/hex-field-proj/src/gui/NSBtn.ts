module PhaserGame.Client {

	export class NSBtn extends Phaser.Button {
		private bg: PhaserNineSlice.NineSlice;
		private label: Phaser.Text;

    constructor(game, x, y, cb, cbc, w, h, label: string) {
      super(game, x, y, null, cb, cbc);
      
      this.bg = new PhaserNineSlice.NineSlice(this.game as any, 0, 0, 'game', 'yellow_button08', w, h,
        { top: 10, bottom: 10, left: 10, right: 10 });
      this.bg.anchor.set(0.5);
      this.addChild(this.bg);

      this.label = new Phaser.Text(this.game, 0, 4, label, {});
      this.label.font = Config.FONT_VS_BOLD;
      this.label.fontSize = 30;
      this.label.addColor('#323232', 0);
      this.label.anchor.set(0.5);
      this.addChild(this.label);

		}
		

	}

}