module P2JSExample.Client {

	export class Preloader extends Phaser.State {

		preload() {
			for (var i = 0; i < Const.cercObjs.length; i++) {
				this.game.load.image(Const.cercObjs[i], './assets/sprites/' + Const.cercObjs[i] + '.png');
			}
			for (var i = 0; i < Const.rectObjs.length; i++) {
				this.game.load.image(Const.rectObjs[i], './assets/sprites/' + Const.rectObjs[i] + '.png');
			}
		}

		create() {
			this.startMainMenu();
		}

		startMainMenu() {
			this.game.state.start(States.GAME, true, false);
		}

	}

}