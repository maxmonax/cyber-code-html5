var MyGame;
(function (MyGame) {
    var GameEngine = (function () {
        function GameEngine() {
            this.clock = new THREE.Clock(true);
            Params.wnd_w = window.innerWidth;
            Params.wnd_h = window.innerHeight;
            var parent = document.getElementById(Config.DOM_PARENT_ID);
            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(Params.wnd_w, Params.wnd_h);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            parent.appendChild(this.renderer.domElement);
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x6077bb);
            this.lignt_amb = new THREE.AmbientLight(0x323232);
            this.scene.add(this.lignt_amb);
            this.lignt_dir = new THREE.DirectionalLight(0xFFFFFF, 2);
            this.lignt_dir.position.set(-500, 600, 750);
            this.lignt_dir.target.position.set(0, 0, 0);
            this.lignt_dir.shadow.camera.near = 1;
            this.lignt_dir.shadow.camera.far = 8000;
            this.lignt_dir.shadow.camera.left = -3000;
            this.lignt_dir.shadow.camera.bottom = -3000;
            this.lignt_dir.shadow.camera.right = 3000;
            this.lignt_dir.shadow.camera.top = 3000;
            this.lignt_dir.shadow.bias = 0.0001;
            this.lignt_dir.shadow.mapSize.width = Config.SHADOW_MAP_WIDTH;
            this.lignt_dir.shadow.mapSize.height = Config.SHADOW_MAP_HEIGHT;
            this.lignt_dir.castShadow = true;
            this.scene.add(this.lignt_dir);
            this.camera = new THREE.PerspectiveCamera(45, Params.wnd_w / Params.wnd_h, Config.CAMERA_NEAR, Config.CAMERA_FAR);
            this.camera.position.set(0, 500, 600);
            this.controls = new THREE.OrbitControls(this.camera);
            this.controls.enablePan = false;
            this.stats = new Stats();
            parent.appendChild(this.stats.dom);
            this.createScene();
        }
        GameEngine.prototype.onWindowResize = function () {
            Params.wnd_w = window.innerWidth;
            Params.wnd_h = window.innerHeight;
            this.renderer.setSize(Params.wnd_w, Params.wnd_h);
            this.camera.aspect = Params.wnd_w / Params.wnd_h;
            this.camera.updateProjectionMatrix();
        };
        GameEngine.prototype.createScene = function () {
            var ah = new THREE.AxesHelper(500);
            var dh = new THREE.DirectionalLightHelper(this.lignt_dir, 100);
            var geometry = new THREE.PlaneBufferGeometry(100, 100);
            var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x505050 });
            var ground = new THREE.Mesh(geometry, planeMaterial);
            ground.position.set(0, 0, 0);
            ground.rotation.x = -Math.PI / 2;
            ground.scale.set(10, 10, 10);
            ground.castShadow = false;
            ground.receiveShadow = true;
            this.scene.add(ground);
            var b_size = 20;
            var road_size = 16;
            var city_size = 26;
            var b_colors = [0x434c83, 0x546d50, 0xa44f3b, 0x7f3d4b];
            for (var i = 0; i < city_size; i++) {
                for (var j = 0; j < city_size; j++) {
                    if (MyMath.randomInRange(0, 10) < 3)
                        continue;
                    var b_h = MyMath.randomIntInRange(b_size, b_size * 6);
                    var b_geom = new THREE.BoxGeometry(b_size, b_h, b_size);
                    var cid = MyMath.randomIntInRange(0, b_colors.length - 1);
                    var b_mat = new THREE.MeshLambertMaterial({ color: b_colors[cid] });
                    var building = new THREE.Mesh(b_geom, b_mat);
                    var pos_x = -city_size / 2 * (b_size + road_size) + i * (b_size + road_size);
                    var pos_z = -city_size / 2 * (b_size + road_size) + j * (b_size + road_size);
                    building.position.set(pos_x, b_h / 2, pos_z);
                    building.castShadow = true;
                    building.receiveShadow = true;
                    this.scene.add(building);
                }
            }
        };
        GameEngine.prototype.animate = function () {
            this.render();
            this.stats.update();
        };
        GameEngine.prototype.render = function () {
            var dt = this.clock.getDelta();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        return GameEngine;
    }());
    MyGame.GameEngine = GameEngine;
})(MyGame || (MyGame = {}));
var gameEng;
window.onload = function () {
    if (!Detector.webgl) {
        document.body.appendChild(Detector.getWebGLErrorMessage());
    }
    else {
        gameEng = new MyGame.GameEngine();
        window.addEventListener('resize', function () {
            gameEng.onWindowResize();
        }, false);
        window.addEventListener('keydown', function () {
        }, false);
        animate();
    }
};
function animate() {
    requestAnimationFrame(this.animate);
    gameEng.animate();
}
var Config;
(function (Config) {
    Config.DOM_PARENT_ID = 'game';
    Config.SHADOW_MAP_WIDTH = 2048;
    Config.SHADOW_MAP_HEIGHT = 2048;
    Config.CAMERA_NEAR = 1;
    Config.CAMERA_FAR = 6000;
})(Config || (Config = {}));
var DB;
(function (DB) {
    DB.ITEMS = [
        { name: 'r', fr: 'red-item', sel: 'red-item-sel', sector: 'red-sector' },
        { name: 'g', fr: 'green-item', sel: 'green-item-sel', sector: 'green-sector' },
        { name: 'b', fr: 'blue-item', sel: 'blue-item-sel', sector: 'blue-sector' }
    ];
})(DB || (DB = {}));
var Params;
(function (Params) {
    Params.isTapToStartBtn = false;
    Params.wnd_w = 0;
    Params.wnd_h = 0;
})(Params || (Params = {}));
var LogMng;
(function (LogMng) {
    LogMng.MODE_DEBUG = 'MODE_DEBUG';
    LogMng.MODE_RELEASE = 'MODE_RELEASE';
    var DEBUG = 'DEBUG';
    var INFO = 'INFO';
    var NETWORK = 'NETWORK';
    var WARNING = 'WARNING';
    var ERROR = 'ERROR';
    var mode = LogMng.MODE_DEBUG;
    var levels = [DEBUG, INFO, NETWORK, WARNING, ERROR];
    function setMode(aMode) {
        mode = aMode;
        switch (mode) {
            case LogMng.MODE_DEBUG:
                levels = [DEBUG, INFO, NETWORK, WARNING, ERROR];
                break;
            case LogMng.MODE_RELEASE:
                levels = [WARNING, ERROR];
                break;
        }
    }
    LogMng.setMode = setMode;
    function getMode() {
        return mode;
    }
    LogMng.getMode = getMode;
    function getCSS(bgColor) {
        return 'background: ' + bgColor + ';' +
            'background-repeat: no-repeat;' +
            'color: #1df9a8;' +
            'line-height: 16px;' +
            'padding: 1px 0;' +
            'margin: 0;' +
            'user-select: none;' +
            '-webkit-user-select: none;' +
            '-moz-user-select: none;';
    }
    ;
    function getLink(color) {
        return 'background: ' + color + ';' +
            'background-repeat: no-repeat;' +
            'font-size: 12px;' +
            'color: #446d96;' +
            'line-height: 14px';
    }
    ;
    function log(aMsg, aLevel) {
        if (aLevel === void 0) { aLevel = DEBUG; }
        if (levels.indexOf(aLevel) < 0)
            return;
        var css = '';
        switch (aLevel) {
            case INFO:
                css = 'background: #308AE4; color: #fff; padding: 1px 4px';
                break;
            case WARNING:
                css = 'background: #f7a148; color: #fff; padding: 1px 4px';
                break;
            case ERROR:
                css = 'background: #DB5252; color: #fff; padding: 1px 4px';
                break;
            case NETWORK:
                css = 'background: #7D2998; color: #fff; padding: 1px 4px';
                break;
            case DEBUG:
            default:
                css = 'background: #ADADAD; color: #fff; padding: 1px 4px';
        }
        console.log("%c%s", css, aLevel, aMsg);
    }
    ;
    function system(aMsg, aLink) {
        if (aLink === void 0) { aLink = ''; }
        console.log("%c %c %c %s %c %c %c %c%s", getCSS('#5C6166'), getCSS('#4F5357'), getCSS('#313335'), aMsg, getCSS('#4F5357'), getCSS('#5C6166'), getLink('none'), getLink('none'), aLink);
    }
    LogMng.system = system;
    function debug(aMsg) {
        log(aMsg, DEBUG);
    }
    LogMng.debug = debug;
    function info(aMsg) {
        log(aMsg, INFO);
    }
    LogMng.info = info;
    function net(aMsg) {
        log(aMsg, NETWORK);
    }
    LogMng.net = net;
    function warn(aMsg) {
        log(aMsg, WARNING);
    }
    LogMng.warn = warn;
    function error(aMsg) {
        log(aMsg, ERROR);
    }
    LogMng.error = error;
})(LogMng || (LogMng = {}));
var MyMath;
(function (MyMath) {
    var Point = (function () {
        function Point() {
        }
        return Point;
    }());
    MyMath.Point = Point;
    var RectABCD = (function () {
        function RectABCD(a, b, c, d) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
        }
        return RectABCD;
    }());
    MyMath.RectABCD = RectABCD;
    function randomInRange(aMin, aMax, auto) {
        if (auto === void 0) { auto = false; }
        if (auto && aMin > aMax) {
            var tmp = aMin;
            aMin = aMax;
            aMax = tmp;
        }
        return Math.random() * Math.abs(aMax - aMin) + aMin;
    }
    MyMath.randomInRange = randomInRange;
    function randomIntInRange(aMin, aMax) {
        return Math.round(randomInRange(aMin, aMax));
    }
    MyMath.randomIntInRange = randomIntInRange;
    function toRadian(aDeg) {
        return aDeg * Math.PI / 180;
    }
    MyMath.toRadian = toRadian;
    function toDeg(aRad) {
        return aRad * 180 / Math.PI;
    }
    MyMath.toDeg = toDeg;
    function IsPointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        var b0x, b0y, c0x, c0y, p0x, p0y;
        var m, l;
        var res = false;
        b0x = bx - ax;
        b0y = by - ay;
        c0x = cx - ax;
        c0y = cy - ay;
        p0x = px - ax;
        p0y = py - ay;
        m = (p0x * b0y - b0x * p0y) / (c0x * b0y - b0x * c0y);
        if (m >= 0 && m <= 1) {
            l = (p0x - m * c0x) / b0x;
            if (l >= 0 && (m + l) <= 1)
                res = true;
        }
        return res;
    }
    MyMath.IsPointInTriangle = IsPointInTriangle;
    function isPointInRect(rect, p) {
        return IsPointInTriangle(rect.a.x, rect.a.y, rect.b.x, rect.b.y, rect.c.x, rect.c.y, p.x, p.y) &&
            IsPointInTriangle(rect.c.x, rect.c.y, rect.d.x, rect.d.y, rect.a.x, rect.a.y, p.x, p.y);
    }
    MyMath.isPointInRect = isPointInRect;
    function isCirclesIntersect(x1, y1, r1, x2, y2, r2) {
        var veclen = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        return veclen <= r1 + r2;
    }
    MyMath.isCirclesIntersect = isCirclesIntersect;
    function cartesianToIsometric(cartPt) {
        var tempPt = new Point();
        tempPt.x = cartPt.x - cartPt.y;
        tempPt.y = (cartPt.x + cartPt.y) / 2;
        return tempPt;
    }
    MyMath.cartesianToIsometric = cartesianToIsometric;
    function isometricToCartesian(isoPt) {
        var tempPt = new Point();
        tempPt.x = (2 * isoPt.y + isoPt.x) / 2;
        tempPt.y = (2 * isoPt.y - isoPt.x) / 2;
        return tempPt;
    }
    MyMath.isometricToCartesian = isometricToCartesian;
})(MyMath || (MyMath = {}));
//# sourceMappingURL=game.js.map