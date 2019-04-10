module PhaserGame.Client {
  const CURSOR_DIST_CLICK = 2;

  const MAP_SCALE_MIN = 0.6;
  const MAP_SCALE_MAX = 4;
  const MAP_SCALE_DEFAULT = 1;

  // scale
  const DELTA_SCALE_MAP = 0.15;

  export class Game extends Phaser.State {
    private dummy: Phaser.Sprite;
    private dummyGui: Phaser.Sprite;
    private btnBack: Phaser.Button;
    private map: Phaser.Sprite;
    private touchLayer: Phaser.Graphics;

    private p1: Phaser.Pointer;
    private p1down = false;
    private p1MapPosDown: Phaser.Point;
    private p2: Phaser.Pointer;
    private p2down = false;
    private p2wasDown = false;
    private p2MapScaleDown = 1;

    // scaling
    private map_scale = 1;
    private map_scale_prev = 1;
    private twMapScale: Phaser.Tween;
    private twMapScaleMove: Phaser.Tween;

    private gameInputX = 0;
    private gameInputY = 0;

    private mouseSpdVector: Phaser.Point;
    private prevMousePos: Phaser.Point;


    create() {
      this.dummy = new Phaser.Sprite(this.game, 0, 0);
      this.add.existing(this.dummy);

      this.dummyGui = new Phaser.Sprite(this.game, 0, 0);
      this.add.existing(this.dummyGui);

      this.map = new Phaser.Sprite(this.game, 0, 0, 'map');
      this.dummy.addChild(this.map);

      this.updateMapScale(true, true);
      this.checkMapScrollOutOfBorders();

      // создаём слой считывания ввода пользователя мышью или тачами для манипуляций над картой
      this.touchLayer = new Phaser.Graphics(this.game, 0, 0);
      this.touchLayer.beginFill(0, 0.0);
      this.touchLayer.drawRect(0, 0, Config.GW, Config.GH);
      this.touchLayer.endFill();
      this.touchLayer.inputEnabled = true;
      this.touchLayer.input.useHandCursor = true;
      this.dummy.addChild(this.touchLayer);
      this.touchLayer.events.onInputDown.add(this.onTouchLayerInputDown, this);
      this.touchLayer.events.onInputUp.add(this.onTouchLayerInputUp, this);

      // mouse wheel event listener
      WndEvents.onGameMouseWheelSignal.add(this.onMouseWheel, this);

      // GUI
      this.btnBack = new Phaser.Button(this.game, 0, 0, 'game', this.onBackClick, this, 'Button_022', 'Button_022');
      this.btnBack.anchor.set(0.5);
      this.btnBack.scale.set(0.8);
      this.updateGuiPos();
      this.dummyGui.addChild(this.btnBack);
    }

    private onBackClick() {
      WndEvents.onGameMouseWheelSignal.remove(this.onMouseWheel, this);
      this.game.state.start(States.MAINMENU, true, false);
    }

    private setMapScale(aNewScale: number) {
      if (aNewScale <= MAP_SCALE_MIN) aNewScale = MAP_SCALE_MIN;
      if (aNewScale >= MAP_SCALE_MAX) aNewScale = MAP_SCALE_MAX;
      this.map_scale = aNewScale;
    }

    private addMapScale(dt: number) {
      // формула, чтобы карта всегда приближалась и отдалялась
      // с одинаковой процентной скоростью независимо от текущего масштаба
      var newScale = this.map_scale + dt * this.map_scale;
      this.setMapScale(newScale);
    }

    private onMouseWheel(e: WheelEvent) {
      if (e.deltaY < 0) {
        // приближение
        this.addMapScale(DELTA_SCALE_MAP);
      }
      else if (e.deltaY > 0) {
        // отдаление
        this.addMapScale(-DELTA_SCALE_MAP);
      }
    }

    private onTouchLayerInputDown(obj, p: Phaser.Pointer) {
      if (this.game.device.desktop) {
        if (p == this.game.input.mousePointer) {
          // scroll or click
          //LogMng.debug('onTouchLayerInputDown desktop: p == this.game.input.mousePointer');
          this.p1 = this.game.input.mousePointer;
          this.p1MapPosDown = this.map.position.clone();
          this.p1down = true;
          this.prevMousePos = this.p1.position.clone();
        }
      }
      else {
        // mobile
        if (p == this.game.input.pointer1) {
          //LogMng.debug('onTouchLayerInputDown mobile: p == this.game.input.pointer1');
          this.p1 = this.game.input.pointer1;
          this.p1MapPosDown = this.map.position.clone();
          this.p1down = true;
          this.prevMousePos = this.p1.position.clone();
        }
        else if (p == this.game.input.pointer2) {
          //LogMng.debug('onTouchLayerInputDown mobile: p == this.game.input.pointer2');
          this.p2 = this.game.input.pointer2;
          this.p2MapScaleDown = this.map_scale;

          // сохраняем координаты точки центра скейла карты (точка между пальцами)
          this.gameInputX = (this.p1.x + this.p2.x) / 2;
          this.gameInputY = (this.p1.y + this.p2.y) / 2;

          this.p2down = true;
          this.p2wasDown = true;
        }
      }
    }

    private onTouchLayerInputUp(obj, p: Phaser.Pointer) {
      if (this.game.device.desktop) {
        if (p == this.game.input.mousePointer) {
          // is it click?
          var dist = this.p1.positionDown.distance(this.p1.positionUp, true);
          if (dist <= CURSOR_DIST_CLICK) {
            LogMng.debug('It is map click!');
          }
          else {
            this.checkMapScrollOutOfBorders(false, 100);
          }
          this.p1down = false;
          this.p1 = null;
        }
      }
      else {
        // mobile
        if (p == this.game.input.pointer1) {
          if (!this.p2down) {
            if (!this.p2wasDown) {
              // check for tap to cell
              var dist = this.p1.positionDown.distance(this.p1.positionUp, true);
              if (dist <= CURSOR_DIST_CLICK) {
                LogMng.debug('It is map tap!');
              }
              else {
                this.checkMapScrollOutOfBorders(false, 100);
              }
            }
            this.p2wasDown = false;
          }
          else {
            this.checkMapScrollOutOfBorders(false, 100);
          }
          this.p1down = false;
          this.p1 = null;
        }
        if (p == this.game.input.pointer2) {
          this.p2down = false;
          this.p2 = null;
        }
      }
    }

    /**
     * Возвращает координаты прямоугольника для отображения карты, а так же мин и макс координаты карты
     */
    private getMapLimits(): any {
      var res = {
        x0: 0,
        y0: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        x_min: 0,
        x_max: 0,
        y_min: 0,
        y_max: 0
      };
      let map_w = this.map.width;
      let map_h = this.map.height;
      let c_x = Config.GW / 2;
      let c_y = Config.GH / 2;
      let view_w = ScaleManager.gameViewW;
      let view_h = ScaleManager.gameViewH;
      let min_w_h = Math.min(view_w, map_w) / 2;
      let min_h_h = Math.min(view_h, map_h) / 2;
      res.x0 = c_x - min_w_h;
      res.y0 = c_y - min_h_h;
      res.x = c_x + min_w_h;
      res.y = c_y + min_h_h;
      res.w = res.x - res.x0;
      res.h = res.y - res.y0;
      res.x_min = res.x - map_w;
      res.x_max = res.x0;
      res.y_min = res.y - map_h;
      res.y_max = res.y0;
      return res;
    }

    private checkMapScrollOutOfBorders(aFast = false, aDur = 500) {
      let mapLimits = this.getMapLimits();
      let mapPos = this.map.position.clone();//.multiply(this.map.scale.x, this.map.scale.y);
      let needTrans = false;

      if (mapPos.x < mapLimits.x_min) {
        needTrans = true;
        mapPos.x = mapLimits.x_min;
      }
      if (mapPos.x > mapLimits.x_max) { //map_w) {
        needTrans = true;
        mapPos.x = mapLimits.x_max;
      }
      if (mapPos.y < mapLimits.y_min) {
        needTrans = true;
        mapPos.y = mapLimits.y_min;
      }
      if (mapPos.y > mapLimits.y_max) {
        needTrans = true;
        mapPos.y = mapLimits.y_max;
      }

      if (needTrans) {
        if (aFast) {
          this.map.x = mapPos.x;
          this.map.y = mapPos.y;
        }
        else {
          let tw = this.game.add.tween(this.map).to({ x: mapPos.x, y: mapPos.y }, aDur, Phaser.Easing.Sinusoidal.Out, true);
        }
      }
    }

    private updateMobileScale() {
      let p1Pos0 = this.p1.positionDown;
      let p2Pos0 = this.p2.positionDown;
      let d0 = p1Pos0.distance(p2Pos0, true);
      let p1Pos = this.p1.position;
      let p2Pos = this.p2.position;
      let d = p1Pos.distance(p2Pos, true);
      let sc = d / d0;
      this.setMapScale(this.p2MapScaleDown * sc);
    }

    private updateMapScale(aMakeDefault = false, aFast = false) {
      if (aMakeDefault) {
        this.map_scale = MAP_SCALE_DEFAULT;
      }
      else {
        var minScale = MAP_SCALE_MIN;
        if (this.map_scale < minScale) this.map_scale = minScale;
        if (this.map_scale <= minScale) {
          //this.guiMng.disableZoomMinusBtn();
        }
        else {
          //this.guiMng.enableZoomMinusBtn();
        }

        var maxScale = MAP_SCALE_MAX;
        if (this.map_scale > maxScale) this.map_scale = maxScale;
        if (this.map_scale >= maxScale) {
          //this.guiMng.disableZoomPlusBtn();
        }
        else {
          //this.guiMng.enableZoomPlusBtn();
        }
      }

      // позиция мыши на карте без учёта скейла перед скейлингом
      let p0x = this.gameInputX - this.map.x;
      let p0y = this.gameInputY - this.map.y;
      // позиция мыши на карте без учёта скейла перед скейлингом
      let px = p0x / this.map.scale.x * this.map_scale;
      let py = p0y / this.map.scale.y * this.map_scale;

      let dx = -(px - p0x);
      let dy = -(py - p0y);

      let newx = this.map.x + dx;
      let newy = this.map.y + dy;

      if (this.twMapScale) this.twMapScale.stop(false);
      if (this.twMapScaleMove) this.twMapScaleMove.stop(false);

      if (aFast) {
        this.map.x = newx;
        this.map.y = newy;
        this.map.scale.set(this.map_scale);
      }
      else {
        this.twMapScaleMove = this.game.add.tween(this.map).to({ x: newx, y: newy }, 100, Phaser.Easing.Sinusoidal.InOut);
        this.twMapScaleMove.start();
        this.twMapScale = this.game.add.tween(this.map.scale).to({ x: this.map_scale, y: this.map_scale }, 100, Phaser.Easing.Sinusoidal.InOut);
        this.twMapScale.start();
      }
    }

    private updateGuiPos() {
      this.btnBack.x = (Config.GW - ScaleManager.gameViewW) / 2 + 70;
      this.btnBack.y = (Config.GH + ScaleManager.gameViewH) / 2 - 70;
    }

    update() {
      let dt = this.game.time.elapsed * 0.001;

      // scroll and mobile scale
      let inertMinVal = 0.1;

      this.updateGuiPos();

      // для PC постоянно сохраняем позицию мышки как позицию точки скейла
      if (this.game.device.desktop) {
        this.gameInputX = this.game.input.x;
        this.gameInputY = this.game.input.y;
      }

      if (this.p1down) {
        if (this.p2down) {
          // mobile scale
          this.updateMobileScale();
        }
        else if (!this.p2wasDown) {
          // scroll
          var p0 = this.p1.positionDown.clone();
          var p = this.p1.position.clone();

          this.mouseSpdVector = p.clone().subtract(this.prevMousePos.x, this.prevMousePos.y);
          this.prevMousePos = this.p1.position.clone();

          p.subtract(p0.x, p0.y);
          this.map.position.set(this.p1MapPosDown.x + p.x, this.p1MapPosDown.y + p.y);
        }
      }
      else if (this.mouseSpdVector && (this.mouseSpdVector.x != 0 || this.mouseSpdVector.y != 0)) {
        // инерционное торможение скрола камеры
        this.mouseSpdVector.multiply(0.85, 0.85);
        let mapLimits = this.getMapLimits();
        if (this.map.x < mapLimits.x_min || this.map.x > mapLimits.x_max) this.mouseSpdVector.x = 0;
        if (this.map.y < mapLimits.y_min || this.map.y > mapLimits.y_max) this.mouseSpdVector.y = 0;
        var dx = this.mouseSpdVector.x;
        var dy = this.mouseSpdVector.y;
        this.map.position.x += dx;
        this.map.position.y += dy;
        if (Math.abs(this.mouseSpdVector.x) <= inertMinVal) this.mouseSpdVector.x = 0;
        if (Math.abs(this.mouseSpdVector.y) <= inertMinVal) this.mouseSpdVector.y = 0;
      }

      // update scale map
      if (this.map_scale != this.map_scale_prev) {
        this.updateMapScale(false, !this.game.device.desktop);
        this.map_scale_prev = this.map_scale;
        LogMng.debug('map_scale: ' + this.map_scale);
      }

    }

  }

}