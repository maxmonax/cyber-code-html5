module PhaserGame.Client {

	export class Preloader extends Phaser.State {
		private dummyLoader: Phaser.Sprite;
		private soundsDecodeWaiting = false;
		private soundsLoading: string[] = [];

		preload() {
			this.dummyLoader = new Phaser.Sprite(this.game, 0, 0);
			this.add.existing(this.dummyLoader);
			
      var l_star = new LoadingStars(this.game, Config.GW / 2, Config.GH / 2);
      l_star.scale.set(1.5);
			this.dummyLoader.addChild(l_star);
			
			// atlases
			this.load.atlasJSONArray('game', './assets/atlases/game.png', './assets/atlases/game.json');
      
      // sprites
      this.load.image('bg', './assets/sprites/demo-pic.jpg');
		}
    
		create() {
      this.onContinueCreate();
		}
		
		protected onContinueCreate() {
			// 'tap to start' for iOS
			if (Params.isTapToStartBtn) {
				this.dummyLoader.visible = false;
				var spr = new Phaser.Sprite(this.game, Config.GW / 2, Config.GH / 2, 'game', 'youtube-like-start-icon');
				spr.anchor.set(0.5);
				this.add.existing(spr);
				this.input.onDown.addOnce(this.startMainMenu, this);
			}
			else {
				this.startMainMenu();
			}
		}

		protected startMainMenu() {
      if (Params.isTapToStartBtn) {
        SndMng.sfxPlay(SndMng.SFX_CLICK, 0);
      }  
			this.game.state.start(States.MAINMENU, true, false);
		}

		update() {
			
		}

	}

}