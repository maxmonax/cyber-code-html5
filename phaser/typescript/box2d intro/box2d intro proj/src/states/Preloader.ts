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
      
      this.game.load.image('block', 'assets/sprites/block.png');
			
			// LOAD SOUNDS
			SndMng.init(this.game, true);
			
		}
    
		create() {
			this.soundsDecodeWaiting = true;
		}
		
		protected onSoundsDecoded() {
			// waiting for preloader animation demo
			this.game.time.events.add(1000, this.onContinueCreate, this);
		}

		protected onContinueCreate() {
			// 'tap to start' for iOS
			if (Params.isMacOS) {
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
      if (Params.isMacOS) {
        SndMng.sfxPlay(SndMng.SFX_CLICK, 0);
      }  
			this.game.state.start(States.MAINMENU, true, false);
		}

		update() {
			if (!this.soundsDecodeWaiting) return;

			var sndDecoded = true;
			for (var i = 0; i < this.soundsLoading.length; i++) {
				var sndName = this.soundsLoading[i];
				if (!this.game.cache.isSoundDecoded(sndName)) {
					sndDecoded = false;
					break;
				}
			}
			if (sndDecoded) {
				this.soundsDecodeWaiting = false;
				this.onSoundsDecoded();
			}
			
		}

	}

}