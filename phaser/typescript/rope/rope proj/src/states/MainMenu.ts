module PhaserGame.Client {

  // settings
  const TAIL_LEN = 1;
  const TAILS_CNT = 400;
  const MAX_WIDTH = 5;
  const MIN_WIDTH = 1;
  const DELTA_W = MAX_WIDTH - MIN_WIDTH;
  const CLR = 0xc98944;

  export class MainMenu extends Phaser.State {
    private nodes = [];
    private canvas: Phaser.Graphics;

    create() {
      for (var i = 0; i < TAILS_CNT; i++) {
        this.nodes[i] = { x: 0, y: 0 };
      };

      this.canvas = this.game.add.graphics(0, 0);
    }

    update() {
      var dt = this.game.time.elapsed * 0.001;

      var headX = this.game.input.x;
      var headY = this.game.input.y;
      this.nodes[0] = { x: headX, y: headY };

      this.canvas.clear();

      // draw head
      this.canvas.beginFill(CLR, 1);
      this.canvas.drawCircle(headX, headY, MAX_WIDTH);

      // draw tail
      this.canvas.moveTo(headX, headY);
      for (var i = 1; i < TAILS_CNT; i++) {
        var nodeAngle = Math.atan2(this.nodes[i].y - this.nodes[i - 1].y, this.nodes[i].x - this.nodes[i - 1].x);
        this.nodes[i] = {
          x: this.nodes[i - 1].x + TAIL_LEN * Math.cos(nodeAngle),
          y: this.nodes[i - 1].y + TAIL_LEN * Math.sin(nodeAngle)
        }
        this.canvas.lineStyle(MAX_WIDTH - DELTA_W * i / TAILS_CNT, 0xc98944, 1);
        this.canvas.lineTo(this.nodes[i].x, this.nodes[i].y);
      }

      this.canvas.endFill();

    }

  }

}