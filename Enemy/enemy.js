import {GLTFLoader} from "../GLTFLoader.js"

class Enemy{
    constructor(x, y, z, checkpoints, speed){
        this.x = x;
        this.y = y;
        this.z = z;
        this.checkpoints = checkpoints;
        this.target = checkpoints[0];
        this.speed = speed;
    }
    move(){
    }
}

export class purpleEnemy extends Enemy{
    constructor(x, y, z, scene, checkpoints =[]){
        super(x, y, z, checkpoints, 5);
        this.loader = new GLTFLoader();
        this.loader.load("./Enemy/enemy_ufoPurple.glb",
            function (gltf){
                //change model coords
                gltf.scene.position.setY(y);
                gltf.scene.scale.set(0.35, 0.35, 0.35)
                gltf.scene.position.setX(x);
                gltf.scene.position.setZ(z);
                //shadow casting on scene
                gltf.scene.traverse((node)=>{
                    if (node.isMesh) node.castShadow = true;
                });
                //add model to scene
                scene.add(gltf.scene);
        });
    }
}