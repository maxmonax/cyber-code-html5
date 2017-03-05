module P2JSExample.Client {

	export class Game extends Phaser.State {

		tfFPS: Phaser.Text;

		create() {
			// for fps displaing
			this.game.time.advancedTiming = true;
			// physics init
			this.physics.startSystem(Phaser.Physics.P2JS);
			// setting gravity
			this.game.physics.p2.gravity.y = 300;
			// adding event listener for mousedown/touch event
			this.game.input.onDown.add(this.onDown, this);

			this.tfFPS = new Phaser.Text(this.game, 5, 5, 'FPS: ', { fill: '#EEEEEE', align: 'left' });
			this.add.existing(this.tfFPS);

			var info = this.add.text(Config.GW - 5, 5, 'Phaser P2 physics test\nclick on the screen and objects', { fill: '#EEEEEE', align: 'right' });
			info.anchor.set(1, 0);

			this.addRandomObject(new Phaser.Point(this.world.centerX, this.world.centerY));
		}

		onDown(pointer: Phaser.Pointer) {
			// checking for bodies under the mouse
			var bodyClicked = this.game.physics.p2.hitTest(pointer.position);
			if (bodyClicked.length == 0) {
				this.addRandomObject(pointer.position);
			}
			else {
				try {
					// destruction of physics body and its graphic asset
					for (var i = 0; i < bodyClicked.length; i++) {
						var spr: Phaser.Sprite = bodyClicked[i]['parent']['sprite'] as Phaser.Sprite;
						if (spr != null) spr.kill();
					}
				}
				catch (e) {
					LogMng.log(e, LogMng.ERROR);
				}
			}

		}

		// creation of physics body and its graphic asset
		addRandomObject(aPos: Phaser.Point) {
			// select random texture
			var isCerc: boolean = MyMath.randomIntInRange(1, 10) <= 5;
			var key = isCerc ? Const.cercObjs[MyMath.randomIntInRange(0, Const.cercObjs.length - 1)] :
				Const.rectObjs[MyMath.randomIntInRange(0, Const.rectObjs.length - 1)];

			var newObj = this.add.sprite(aPos.x, aPos.y, key);

			// enable physics to graphic
			this.game.physics.p2.enable(newObj);

			// make circle
			if (isCerc)
				newObj.body.setCircle(35);
		}

		update() {

		}

		render() {
			// update FPS
			this.tfFPS.text = 'FPS: ' + (String(this.game.time.fps) || '--');
    }

	}

}