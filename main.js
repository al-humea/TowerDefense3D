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
const spawn = [map.spawn.position.x-0.15, map.spawn.position.z + 0.15];

//Enemies
import { purpleEnemy } from "./Enemy/Enemy.js";
const enemies = [];
let enemy = new purpleEnemy(spawn[0], spawn[1], scene);
enemies.push(enemy);

//main
let delta = 0;
let last_time = 0;
function display(time){
    delta = time - last_time;
    last_time = time;
    //update enemies
    enemies.forEach((e)=>{
        e.move(delta);
    });
    //update towers
    //update projectiles
    //disp gui
    renderer.render(scene, camera);

    requestAnimationFrame(display);
}
requestAnimationFrame(display);