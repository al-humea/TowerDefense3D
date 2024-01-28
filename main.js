import * as THREE from './Addons/three.module.js'
import { OrbitControls } from './Addons/OrbitControls.js';

const cnv = document.getElementById("screen");
const renderer = new THREE.WebGLRenderer({canvas:cnv, antialiasing:true, alpha:true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

const camera = new THREE.PerspectiveCamera(75, cnv.width/cnv.height, 0.1, 1000);

camera.position.z = 25;
camera.position.y = 25;
camera.rotation.x = THREE.MathUtils.degToRad(-45);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
controls.enabled = false;

// Create the menu scene
import {Menu} from "./Menu/menu.js"
const scene = new Menu(new THREE.Scene(), camera);
window.addEventListener("pointermove", scene.onPointerMove);
window.addEventListener("pointerup", ev => scene.onPointerUp(ev));

const loader = new THREE.CubeTextureLoader();
loader.setPath( '/skybox/' );
const textureCube = loader.load([
  'right.png', 'left.png',//
  'top.png', 'bottom.png',
  'front.png', 'back.png'
]);

scene.background = textureCube;



//lumières
const ambiLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambiLight);
const direLight = new THREE.DirectionalLight(0xffffff, 1.3);
direLight.position.y = 4;
direLight.position.z = 3;
direLight.castShadow = true;
direLight.shadow.normalBias = 0.1;
const hemiLight = new THREE.HemisphereLight(0xffffff,0xfffafa, 0.4);
hemiLight.position.y = 4;
hemiLight.position.z = 3;
scene.add(hemiLight);
scene.add(direLight);

//MAP
import {Map} from "./Map/map.js"
const map = new Map(scene);
const spawn = [map.spawn.x-0.15, 0.3, map.spawn.z + 0.15];//xyz spawn
const midCheckpoints = map.checkpoints;
const topCheckpoints = midCheckpoints.map((x, i)=>{
  if (i == 1 || i == 2)
    return new THREE.Vector3(x.x+0.25, x.y, x.z+0.25)
  return new THREE.Vector3(x.x+0.25, x.y, x.z-0.25)
});
const botCheckpoints = midCheckpoints.map((x, i)=>{
  if (i == 1 || i == 2)
    return new THREE.Vector3(x.x-0.25, x.y, x.z-0.25)
  return new THREE.Vector3(x.x-0.25, x.y, x.z+0.25)
});

//debug showing middlecheckpoints
/*const lineMat = new THREE.LineBasicMaterial({
    color:0xFF0000,
    linewidth:1,
})
let lineGeo = null;
midCheckpoints.forEach((x)=>{
    lineGeo = new THREE.BufferGeometry().setFromPoints([x, new THREE.Vector3(x.x, x.y+spawn[1], x.z)]);
    scene.add(new THREE.Line(lineGeo, lineMat));
});*/

//Enemies
import { Spawner } from "./Enemy/enemy.js";
const enemies = [];
const spawner = new Spawner(scene, enemies, spawn, midCheckpoints, topCheckpoints, botCheckpoints);

//Towers
import { Projectile, CannonTower, MageTower } from './Tower/tower.js';
const towers = [];

let towerPos= [0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
               0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
               2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
               0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 2, 0, 0, 0, 0]

for (let z = 0; z < 10; z++) {
  for (let x = 0; x < 10; x++) {
    if (towerPos[x + z*10] == 1)
      towers.push(new CannonTower(-4.5+x, -6.5+z, scene));
    if (towerPos[x + z*10] == 2)
      towers.push(new MageTower(-4.5+x, -6.5+z, scene));
  }
}

//main
let delta = 0;
let last_time = 0;
let state = 0; // 0-Menu <> 1-Transition <> 2-Game
function display(time){
    delta = (time - last_time) * 0.001;//to_s
    last_time = time;
    switch(state) {
      case 0:
        scene.interaction();
        renderer.render(scene, camera);
        if (scene.buttonClicked) {
          state = 1;
        }
        break;
      case 1:
        camera.position.y -= 30*delta;
        camera.position.z -= 30*delta;
        renderer.render(scene, camera);
        if (camera.position.y <= 5) {
          state = 2;
          controls.enabled = true;
        }
        break;
      case 2:
        spawner.spawn(delta);
        enemies.forEach((e)=>e.move(delta));
        towers.forEach((e)=>e.update(delta, enemies));
        Projectile.update(delta);
        renderer.render(scene, camera);
        break;
    }

    requestAnimationFrame(display);
}
requestAnimationFrame(display);