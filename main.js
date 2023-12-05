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
const checkpoints = map.checkpoints;

//debug
const lineMat = new THREE.LineBasicMaterial({
    color:0xFF0000,
    linewidth:1,
})
let lineGeo = null;
checkpoints.forEach((x)=>{
    lineGeo = new THREE.BufferGeometry().setFromPoints([x, new THREE.Vector3(x.x, x.y+spawn[1], x.z)]);
    scene.add(new THREE.Line(lineGeo, lineMat));
});

//Enemies
import { purpleEnemy} from "./Enemy/enemy.js";
const enemies = [];
let enemy = new purpleEnemy(spawn[0], spawn[1], spawn[2], scene, checkpoints);
enemies.push(enemy);

//main
let delta = 0;
let last_time = 0;
function display(time){
    delta = (time - last_time) * 0.001;//to_s
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