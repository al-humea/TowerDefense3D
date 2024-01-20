import * as THREE from './Addons/three.module.js'
import { OrbitControls } from './Addons/OrbitControls.js';

const cnv = document.getElementById("screen");
const renderer = new THREE.WebGLRenderer({canvas:cnv, antialiasing:true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, cnv.width/cnv.height, 0.1, 1000);
const scene = new THREE.Scene();
camera.position.z = 5;
camera.position.y = 5;
camera.rotation.x = THREE.MathUtils.degToRad(-45);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

//Visuals
import {Lights, Process} from "./Visuals/visuals.js"

const lumieres = new Lights(scene);
const process = new Process(renderer, scene, camera);
// const renderer = process.renderer();

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
//skybox
const loader = new THREE.CubeTextureLoader();
loader.setPath( '/Map/skybox/' );
const textureCube = loader.load([
  'right.png', 'left.png',//
  'top.png', 'bottom.png',
  'front.png', 'back.png'
]);
scene.background = textureCube;

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
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight);
  process.bloomComposer.setSize(window.innerWidth, window.innerHeight);
  process.finalComposer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);
let delta = 0;
let last_time = 0;
function display(time){
    delta = (time - last_time) * 0.001;//to_s
    last_time = time;
    spawner.spawn(delta);
    enemies.forEach((e)=>e.move(delta));
    towers.forEach((e)=>e.update(delta, enemies));
    Projectile.update(delta);

    // postprocess selective bloom
    process.bloomComposer.render();
    requestAnimationFrame(display);
}
requestAnimationFrame(display);