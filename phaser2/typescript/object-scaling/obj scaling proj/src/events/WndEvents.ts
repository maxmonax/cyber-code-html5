namespace WndEvents {

  export let isMouseInGame = true;

  // attributes: (e: WheelEvent)
  export const onGameMouseWheelSignal = new Phaser.Signal();

  function initMouseInOutEvent() {
    var dom = document.getElementById(Config.DOM_PARENT_ID);
    dom.onmouseover = () => {
      isMouseInGame = true;
    };
    dom.onmouseout = () => {
      isMouseInGame = false;
    };
  }

  function onMouseWheelEvent(e: WheelEvent) {
    onGameMouseWheelSignal.dispatch(e);
  }

  export function init(aPhaserGame: Phaser.Game) {
    initMouseInOutEvent();
    aPhaserGame.input.mouse.mouseWheelCallback = onMouseWheelEvent;
  }
  

}