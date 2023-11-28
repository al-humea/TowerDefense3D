//canva setup
let cnv = document.getElementById("screen");
//renderer et camera
let renderer = new THREE.WebGLRenderer({canvas:cnv, antialiasing:true});
let camera = new THREE.PerspectiveCamera(75, cnv.width/cnv.height, 0.1, 1000);
let scene = new THREE.Scene();
camera.position.z = 5;
camera.position.y = 5;
camera.rotation.x = THREE.MathUtils.degToRad(-45);

//lumières
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.y = 5;
directionalLight.position.z = 5;
const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add(directionalLight);
scene.add(helper);

//map temporaire
const planeGeo = new THREE.PlaneGeometry(0.90, 0.90, 10, 10);
const planeWhiteMat = new THREE.MeshStandardMaterial ({color:"white"});
const planeRedMat = new THREE.MeshStandardMaterial ({color:"grey"});
let plane;
const planeList = [];
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
        scene.add(plane);
        planeList.push(plane);
    }
}

//main
let delta = 0;
let last_time = 0;
function display(time){
    delta = time - last_time;
    last_time = time;
    //disp enemies + delta
    //disp towers + delta
    //disp projectiles
    //disp gui
    renderer.render(scene, camera);
    requestAnimationFrame(display);
}
requestAnimationFrame(display);