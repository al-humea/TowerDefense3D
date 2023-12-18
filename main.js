import * as THREE from './three.module.js'
import { OrbitControls } from './OrbitControls.js';

//canva setup
const cnv = document.getElementById("screen");

//renderer et camera
const renderer = new THREE.WebGLRenderer({canvas:cnv, antialiasing:true});
renderer.shadowMap.enabled = true;
const camera = new THREE.PerspectiveCamera(75, cnv.width/cnv.height, 0.1, 1000);
const scene = new THREE.Scene();
camera.position.z = 5;
camera.position.y = 5;
camera.rotation.x = THREE.MathUtils.degToRad(-45);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

//lumières
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0);
directionalLight.position.y = 4;
directionalLight.position.z = 3;
directionalLight.castShadow = true;
const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add(directionalLight);
scene.add(helper);

//map temporaire
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
const lineMat = new THREE.LineBasicMaterial({
    color:0xFF0000,
    linewidth:1,
})
let lineGeo = null;
midCheckpoints.forEach((x)=>{
    lineGeo = new THREE.BufferGeometry().setFromPoints([x, new THREE.Vector3(x.x, x.y+spawn[1], x.z)]);
    scene.add(new THREE.Line(lineGeo, lineMat));
});

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
function display(time){
    delta = (time - last_time) * 0.001;//to_s
    last_time = time;
    //update enemies list and move enemies
    spawner.spawn(delta);
    enemies.forEach((e)=>e.move(delta));
    towers.forEach((e)=>e.update(delta, enemies));
    Projectile.update(delta);
    //update projectiles
    //disp gui
    renderer.render(scene, camera);

    requestAnimationFrame(display);
}
requestAnimationFrame(display);