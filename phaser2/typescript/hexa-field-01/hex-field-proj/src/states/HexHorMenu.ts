module PhaserGame.Client {

  const MAP = [
    [{ tid: 2 }, { tid: 1 }, { tid: 1 }, { tid: 0 }, { tid: 0 }],
    [{ tid: 1 }, { tid: 1 }, { tid: 0 }, { tid: 0 }, { tid: 0 }],
    [{ tid: 1 }, { tid: 1 }, { tid: 0 }, { tid: 1 }, { tid: 1 }],
    [{ tid: 0 }, { tid: 0 }, { tid: 1 }, { tid: 3 }, { tid: 2 }],
    [{ tid: 0 }, { tid: 0 }, { tid: 1 }, { tid: 2 }, { tid: 1 }]
  ];

  const TILE_SIZE = { w: 120, h: 138 };
  const FIELD_POS = { x: 250, y: 100 };

  export class HexHorMenu extends Phaser.State {
    private mainDummy: Phaser.Sprite;
    private btnBack: Phaser.Button;
    private tnid = 0;
    private glow: Phaser.Sprite;

    private sectorWidth = TILE_SIZE.w;
    private sectorHeight = 3/4 * TILE_SIZE.h;

    private mapWidth = MAP[0].length;
    private mapHeight = MAP.length;

    create() {
      this.mainDummy = new Phaser.Sprite(this.game, 0, 0);
      this.add.existing(this.mainDummy);

      // random tile name id
      this.tnid = MyMath.randomIntInRange(0, 2);

      for (var j = 0; j < this.mapHeight; j++) {
        const row = MAP[j];
        for (let i = 0; i < row.length; i++) {
          const tid = row[i].tid;
          var tpos = this.getTilePosition(i, j);
          var tile = new Phaser.Sprite(this.game, tpos.x, tpos.y, 'game', DB.getTileFrameName(this.tnid, tid));
          tile.anchor.set(0.5);
          this.mainDummy.addChild(tile);
        }
      }

      this.glow = new Phaser.Sprite(this.game, 0, 0, 'game', 'glow');
      this.glow.alpha = 0;
      this.glow.anchor.set(0.5);
      this.mainDummy.addChild(this.glow);

      this.btnBack = new Phaser.Button(this.game, 60, 640, 'game', this.onBackClick, this, 'Button_023', 'Button_023');
      this.btnBack.anchor.set(0.5);
      this.btnBack.scale.set(0.7);
      this.mainDummy.addChild(this.btnBack);
    }

    private onBackClick() {
      this.game.state.start(States.MAINMENU, true, false);
    }

    private getTilePosition(col_id: number, row_id: number): Phaser.Point {
      var res = new Phaser.Point(
        FIELD_POS.x + col_id * this.sectorWidth + (row_id % 2 > 0 ? this.sectorWidth / 2 : 0),
        FIELD_POS.y + row_id * this.sectorHeight
      );
      return res;
    }

    private checkTile() {
      // позиция курсора на поле, с началом координат в левом верхнем углу тайлов
      var mfpos_x = this.game.input.worldX - FIELD_POS.x + this.sectorWidth / 2;
      var mfpos_y = this.game.input.worldY - FIELD_POS.y + this.sectorHeight / 2;

      // ориентировочные координаты клетки в массиве
      var celly = Math.floor(mfpos_y / this.sectorHeight);
      if (Math.abs(celly) % 2 != 0) mfpos_x -= this.sectorWidth / 2;
      var cellx = Math.floor(mfpos_x / this.sectorWidth);

      // значения от 0 до this.sectorWidth
      var deltaX = mfpos_x % this.sectorWidth;
      if (deltaX < 0) deltaX += this.sectorWidth;
      // 0 - this.sectorHeight
      var deltaY = mfpos_y % this.sectorHeight;
      if (deltaY < 0) deltaY += this.sectorHeight;

      var tan = (TILE_SIZE.h / 4) / (TILE_SIZE.w / 2);

      var w1 = 0;
      var h1 = 0;
      if (deltaX > this.sectorWidth / 4 * 3) {
        // правый уголок
        w1 = deltaX - this.sectorWidth / 4 * 3;
        if (deltaY < this.sectorHeight / 2) {
          // верхний уголок
          h1 = deltaY;
          if (h1 / w1 < tan) {
            celly--;
            // если новый ряд нечётный, то + ещё сдвигаемся по x
            if (celly % 2 == 0) cellx++;
          }
        }
        else {
          //  нижний уголок
          h1 = this.sectorHeight - deltaY;
          if (h1 / w1 < tan) {
            celly++;
            if (celly % 2 == 0) cellx++;
          }
        }
      }
      else if (deltaX < this.sectorWidth / 4) {
        // левый уголок
        w1 = this.sectorWidth / 4 - deltaX;
        if (deltaY < this.sectorHeight / 2) {
          // верхний уголок
          h1 = deltaY;
          if (h1 / w1 < tan) {
            celly--;
            if (celly % 2 != 0) cellx--;
          }
        }
        else {
          // нижний уголок
          h1 = this.sectorHeight - deltaY;
          if (h1 / w1 < tan) {
            celly++;
            if (celly % 2 != 0) cellx--;
          }
        }
      }

      if (cellx < 0 || cellx > this.mapWidth - 1) return;
      if (celly < 0 || celly > this.mapHeight - 1) return;

      this.placeMarker(cellx, celly);
    }

    private placeMarker(cellx, celly) {
      var tpos = this.getTilePosition(cellx, celly);
      this.glow.position.set(tpos.x, tpos.y);
      this.glow.alpha = 1;
      this.glow.visible = true;
    }

    update() {
      var dt = this.game.time.elapsed * 0.001;
      this.checkTile();
    }

  }

}