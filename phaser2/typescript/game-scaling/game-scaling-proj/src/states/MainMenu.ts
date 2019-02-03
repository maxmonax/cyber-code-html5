module PhaserGame.Client {

	export class MainMenu extends Phaser.State {
    private bg: Phaser.Sprite;
    
		create() {
			this.bg = new Phaser.Sprite(this.game, 0, 0, 'bg');
			this.add.existing(this.bg);
		}

    update() {
      
		}

	}

}