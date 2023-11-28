import * as THREE from './three.module.js'
import { OrbitControls } from './OrbitControls.js';
import { purpleEnemy } from "./Enemy/Enemy.js";

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
const planeGeo = new THREE.PlaneGeometry(0.90, 0.90, 10, 10);
const planeWhiteMat = new THREE.MeshStandardMaterial ({color:"white"});
const planeRedMat = new THREE.MeshStandardMaterial ({color:"grey"});
const planeList = [];
let plane;
for (let i = 0; i < 10; i++){
    for (let j = 0; j < 10; j++){
        if ((i == 8 && j < 8) || (i < 8 && i > 3 && j == 7)||
            (i == 4 && j < 8 && j >1) || (j==2 && i > 0 && i < 4)||
            (i == 1 && j > 1))
            plane = new THREE.Mesh(planeGeo, planeRedMat);
        else plane = new THREE.Mesh(planeGeo, planeWhiteMat);
        plane.position.x = -4.5 + j;
        plane.position.z = 2.5 - i;
        plane.rotation.x = THREE.MathUtils.degToRad(-90);
        plane.receiveShadow = true;
        scene.add(plane);
        planeList.push(plane);
    }
}

//Enemies
const spawn = [planeList[80].position.x-0.15, planeList[80].position.z + 0.15];
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