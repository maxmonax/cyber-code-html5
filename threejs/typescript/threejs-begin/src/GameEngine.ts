module MyGame {

  export class GameEngine {


    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private lignt_dir: THREE.DirectionalLight;
    private lignt_amb: THREE.AmbientLight;
    private controls: THREE.OrbitControls;

    // utils
    private stats: Stats;
    private clock = new THREE.Clock(true);

    constructor() {
      Params.wnd_w = window.innerWidth;
      Params.wnd_h = window.innerHeight;

      var parent = document.getElementById(Config.DOM_PARENT_ID);

      // RENDERER

      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(Params.wnd_w, Params.wnd_h);
      this.renderer.shadowMap.enabled = true;
      //this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      parent.appendChild(this.renderer.domElement);

      // SCENE

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x6077bb);

      // LIGHTS

      this.lignt_amb = new THREE.AmbientLight(0x323232);
      this.scene.add(this.lignt_amb);

      this.lignt_dir = new THREE.DirectionalLight(0xFFFFFF, 2);
      this.lignt_dir.position.set(-500, 600, 750);
      this.lignt_dir.target.position.set(0, 0, 0);
      // light shadow setting
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

      // CAMERA

      this.camera = new THREE.PerspectiveCamera(45, Params.wnd_w / Params.wnd_h, Config.CAMERA_NEAR, Config.CAMERA_FAR);
      this.camera.position.set(0, 500, 600);

      // CAMERA CONTROL

      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.enablePan = false;
      //this.controls.maxPolarAngle = 10;
      //this.controls.minPolarAngle = 0;

      this.stats = new Stats();
      parent.appendChild(this.stats.dom);

      this.createScene();
    }

    onWindowResize() {
      Params.wnd_w = window.innerWidth;
      Params.wnd_h = window.innerHeight;
      this.renderer.setSize(Params.wnd_w, Params.wnd_h);
      this.camera.aspect = Params.wnd_w / Params.wnd_h;
      this.camera.updateProjectionMatrix();
    }

    private createScene() {

      // HELPERS

      var ah = new THREE.AxesHelper(500);
      //this.scene.add(ah);

      var dh = new THREE.DirectionalLightHelper(this.lignt_dir, 100);
      //this.scene.add(dh);

      // GROUND

      var geometry = new THREE.PlaneBufferGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x505050 });
      var ground = new THREE.Mesh(geometry, planeMaterial);
      ground.position.set(0, 0, 0);
      ground.rotation.x = -Math.PI / 2;
      ground.scale.set(10, 10, 10);
      ground.castShadow = false;
      ground.receiveShadow = true;
      this.scene.add(ground);

      // BUILDINGS

      var b_size = 20;
      var road_size = 16;
      var city_size = 26;
      var b_colors = [0x434c83, 0x546d50, 0xa44f3b, 0x7f3d4b];
      for (let i = 0; i < city_size; i++) {
        for (let j = 0; j < city_size; j++) {
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

    }

    animate() {
      this.render();
      this.stats.update();
    }

    private render() {
      var dt = this.clock.getDelta();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

  }
}

var gameEng: MyGame.GameEngine;

window.onload = () => {
  if (!Detector.webgl) {
    document.body.appendChild(Detector.getWebGLErrorMessage());
  }
  else {
    gameEng = new MyGame.GameEngine();
    window.addEventListener('resize', () => {
      gameEng.onWindowResize();
    }, false);
    window.addEventListener('keydown', () => {

    }, false);
    animate();
  }
};

function animate() {
  requestAnimationFrame(this.animate);
  gameEng.animate();
}