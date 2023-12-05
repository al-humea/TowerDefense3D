import {GLTFLoader} from "../GLTFLoader.js"
import * as THREE from "../three.module.js"

class Enemy{
    constructor(x, y, z, checkpoints){
        this.model;
        this.pos = new THREE.Vector3(x, y, z);
        this.checkpoints = checkpoints;
        this.target = checkpoints[0];
        this.life = 100;
    }
    async move(delta){
        let angle = Math.atan2(this.pos.z - this.target.z, this.pos.x- this.target.x);
        let velx = Math.cos(angle) * delta;
        let velz = Math.sin(angle) * delta;
        this.pos.x -= velx;
        this.pos.z -= velz;
    }
    takedmg(dmg){
        console.log("Enemy took dmgs");
        this.life -= dmg;
    }
}

export class purpleEnemy extends Enemy{
    constructor(x, y, z, scene, checkpoints =[]){
        super(x, y, z, checkpoints);
        this.loader = new GLTFLoader();
        this.loader.load("./Enemy/enemy_ufoPurple.glb",
            (gltf)=>{
                //change model coords
                this.model = gltf.scene;
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