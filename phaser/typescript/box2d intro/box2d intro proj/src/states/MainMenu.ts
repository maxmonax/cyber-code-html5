module PhaserGame.Client {

  // settings


  export class MainMenu extends Phaser.State {
    private platformSprite: Phaser.Sprite;
    private blockSprite: Phaser.Sprite;
    private tfFPS: Phaser.Text;

    create() {
      this.game.time.advancedTiming = true;

      this.game.physics.startSystem(Phaser.Physics.BOX2D);
      this.game.physics.box2d.gravity.y = 500;
      this.game.physics.box2d.setBoundsToWorld();
      this.game.physics.box2d.debugDraw.shapes = true;

      var b = new Phaser.Physics.Box2D.Body(this.game, null, 10, 10);

      // Static platform 
      //this.platformSprite = this.game.add.sprite(400, 550, 'platform');
      //this.game.physics.box2d.enable(this.platformSprite);
      //this.platformSprite.body.static = true;

      // Dynamic box
      this.blockSprite = this.game.add.sprite(100, 100, 'block');
      this.game.physics.box2d.enable(this.blockSprite);
      //this.blockSprite.body.angle = 30;

      var b = this.game.physics.box2d.createCircle(300, 300, 32);
      b.static = true;

      //var b = this.game.physics.box2d.createRectagle(300, 300, 32);
      //b.static = true;

      this.game.input.onDown.add(this.mouseDragStart, this);
      this.game.input.addMoveCallback(this.mouseDragMove, this);
      this.game.input.onUp.add(this.mouseDragEnd, this);


      this.tfFPS = new Phaser.Text(this.game, 5, 5, 'FPS: ', { fill: '#EEEEEE', align: 'left' });
      this.add.existing(this.tfFPS);
    }



    mouseDragStart() {
      this.game.physics.box2d.mouseDragStart(this.game.input.mousePointer);
    }

    mouseDragMove() {
      this.game.physics.box2d.mouseDragMove(this.game.input.mousePointer);
    }

    mouseDragEnd() {
      this.game.physics.box2d.mouseDragEnd();
    }

    render() {
      this.game.debug.box2dWorld();
      // update FPS
      this.tfFPS.text = 'FPS: ' + (String(this.game.time.fps) || '--');
    }

    update() {
      var dt = this.game.time.elapsed * 0.001;


    }

  }

}