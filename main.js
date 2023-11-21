//canva setup
let cnv = document.getElementById("screen");
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;
//renderer
let renderer = new THREE.WebGLRenderer({canvas:cnv, antialiasing:true});
let camera = new THREE.PerspectiveCamera(75, cnv.width/cnv.height, 0.1, 1000);
let scene = new THREE.Scene();
//scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
camera.position.z = 3;

scene.add(directionalLight);
scene.add(plane);

function display(time){
    //clear screen

    //disp map
    //disp enemies + delta
    //disp towers + delta
    //disp projectiles
    //disp gui
    renderer.render(scene, camera);
    requestAnimationFrame(display);
}
requestAnimationFrame(display);