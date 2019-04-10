// static configs

namespace Config {
  export const DOM_PARENT_ID = 'game';

  // game full area (GWxGSH =~ 19x9 for iPhone X, because need browser top panel height compensation)
  export const GW = 2000;
  export const GH = 1000;

  // game safe area (GSWxGH = 4x3 for iPad)
  export const GSW = 500;
  export const GSH = 1000;

  export const FPS = 12;

  // orientation config
  export const isLockOrientation = false;
  export const lockOrientationMobileOnly = false;
  export const lockOrientationLand = true;

}