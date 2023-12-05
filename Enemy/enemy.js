import {GLTFLoader} from "../GLTFLoader.js"
import * as THREE from "../three.module.js"

class Enemy{
    constructor(x, y, z, checkpoints, speed){
        this.internal_clock = 0.0;
        this.model;
        this.speed = speed;
        this.loaded = false;
        this.pos = new THREE.Vector3(x, y, z);
        this.checkpoints = checkpoints.map((e)=> new THREE.Vector3(e.x, y, e.z));
        this.life = 100;
        this.direction = new THREE.Vector3();
    }
    animate(delta){
        this.internal_clock += delta;
        this.pos.setY(Math.sin(this.internal_clock * 5) * 0.025 + 0.35);
    }
    move(delta){
        //if not loaded or no more checkpoints stop moving
        if (!this.loaded || this.checkpoints.length == 0)
            return ;
        this.animate(delta);
        this.direction.subVectors(this.checkpoints[0], this.pos).normalize();
        this.pos.addScaledVector(this.direction, delta * this.speed);
        if (this.pos.distanceTo(this.checkpoints[0]) < 0.1){
            this.checkpoints.shift();
            if (!this.checkpoints)
                console.log("end");
        }
        this.model.position.set(this.pos.x, this.pos.y, this.pos.z);
    }
    takedmg(dmg){
        console.log("Enemy took dmgs");
        this.life -= dmg;
    }
}

export class purpleEnemy extends Enemy{
    constructor(x, y, z, scene, checkpoints =[]){
        super(x, y, z, checkpoints, 0.5);
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
                this.loaded = true;
        });
    }
}