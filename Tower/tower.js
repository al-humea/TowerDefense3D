import {GLTFLoader} from "../Addons/GLTFLoader.js";
import * as THREE from "../Addons/three.module.js";

class Tower {
    static list = [];
    static scale = 0.95;
    constructor(x, z, cd, range) {
        this.pos = new THREE.Vector2(x, z);
        this.cooldown = 0;
        this.maxCooldown = cd;
        this.range = range;
        this.target = null;
    }

    targetKilled() {
        this.target = null;
    }
}

export class CannonTower extends Tower {
    constructor(x, z, scene){
        super(x, z, 1.5, 2);
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.loader.load("./Tower/towerRound_sampleC.glb",
            function (gltf){
                //change model coords
                gltf.scene.position.set(x, 0, z);
                gltf.scene.scale.multiplyScalar(Tower.scale);
                //shadow casting on scene
                gltf.scene.traverse((node)=>{
                    if (node.isMesh){
                      node.castShadow = true;
                      node.receiveShadow = true;
                      node.depthPacking = THREE.RGBADepthPacking;
                      node.material.roughness = 1.0;
                      node.material.metalness = 0.0;
                    }
                });
                //add model to scene
                scene.add(gltf.scene);
        });
        let parentTower = this;
        this.cannon = null;
        this.loader.load("./Tower/canon.glb",
            function (gltf){
                //change model coords
                gltf.scene.position.set(x, 0.75*Tower.scale, z);
                gltf.scene.scale.multiplyScalar(Tower.scale);
                //shadow casting on scene
                gltf.scene.traverse((node)=>{
                  if (node.isMesh){
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                //add model to scene
                parentTower.cannon = gltf.scene;
                scene.add(gltf.scene);
        });
    }
    
    update(dt, enemies) {
        // takes care of fire cooldown
        if (this.cooldown < this.maxCooldown)
            this.cooldown += dt;
        else if (this.cooldown > this.maxCooldown)
            this.cooldown = this.maxCooldown;

        // check for target
        this.targetCheck(enemies);
    }

    targetCheck(enemies) {
        // if already got target
        if (this.target) {
            // check if target out of range or target dead
            if ((this.pos.distanceTo(new THREE.Vector2(this.target.pos.x, this.target.pos.z))) >= this.range
             || this.target.life <= 0) {
                this.target = null;
            }
            else {
                // fire when cooldown is up (+ safecheck if target not already dead)
                if (this.cooldown >= this.maxCooldown && this.target.life > 0) {
                    let offsetDirection = (new THREE.Vector2(this.target.pos.x, this.target.pos.z).sub(new THREE.Vector2(this.pos.x, this.pos.y))).normalize();
                    let fireProjectile = new Projectile(0, this.target, this.scene, this, new THREE.Vector3(this.pos.x + offsetDirection.x*0.2,
                                                                                                            1.1,
                                                                                                            this.pos.y + offsetDirection.y*0.2));
                    this.cooldown = 0;
                    // playSound('./Music/canon.mp3',0.1);
                }
                // rotate the cannon in direction to the target
                this.cannon.lookAt(this.cannon.position.x + (this.cannon.position.x-this.target.pos.x),
                                   this.cannon.position.y,
                                   this.cannon.position.z + (this.cannon.position.z-this.target.pos.z));
            }
        }
        // else, search for target within range
        else {
            (enemies.toReversed()).some(enemy => {
                if ((this.pos.distanceTo(new THREE.Vector2(enemy.pos.x, enemy.pos.z))) < this.range && enemy.life > 0) {
                    this.target = enemy;
                    return true;
                }
            });
        }
    }
}

export class MageTower extends Tower {
    constructor(x, z, scene){
        super(x, z, 2, 3);
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.loader.load("./Tower/towerSquare_sampleB.glb",
            function (gltf){
                //change model coords
                gltf.scene.position.set(x, 0, z);
                gltf.scene.scale.multiplyScalar(Tower.scale);
                //shadow casting on scene
                gltf.scene.traverse((node)=>{
                  if (node.isMesh){
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                //add model to scene
                scene.add(gltf.scene);
        });
        // bullet visible even before firing, "growing" above the tower depending of its cooldown
        this.bullet = new THREE.Mesh(Projectile.geos[1], Projectile.mats[1]);
        this.bullet.position.set(x, 1.85, z);
        scene.add(this.bullet);
    }

    update(dt, enemies) {
        // takes care of fire cooldown
        if (this.cooldown < this.maxCooldown)
            this.cooldown += dt;
        else if (this.cooldown > this.maxCooldown)
            this.cooldown = this.maxCooldown;

        // bullet grow in relation to the cooldown
        if (this.cooldown > 1)
            this.bullet.scale.setScalar(this.cooldown-1);
        else
            this.bullet.scale.setScalar(0);

        // check for target
        this.targetCheck(enemies);
    }

    targetCheck(enemies) {
        // if already got target
        if (this.target) {
            // check if target out of range or target dead
            if ((this.pos.distanceTo(new THREE.Vector2(this.target.pos.x, this.target.pos.z))) >= this.range
              || this.target.life <= 0) {
                this.target = null;
            }
            else {
                // fire when cooldown is up
                if (this.cooldown >= this.maxCooldown) {
                    let fireProjectile = new Projectile(1, this.target, this.scene, this, new THREE.Vector3(this.pos.x, 1.85, this.pos.y));
                    this.cooldown = 0;
                    // playSound('./Music/mage.mp3',0.3);
                }
            }
        }
        // else, search for target within range
        else {
            (enemies.toReversed()).some(enemy => {
                if ((this.pos.distanceTo(new THREE.Vector2(enemy.pos.x, enemy.pos.z))) < this.range && enemy.life > 0) {
                    this.target = enemy;
                    return true;
                }
            });
        }
    }
}

export class Projectile {
    static list = [];
    static geos = [new THREE.SphereGeometry(0.1), new THREE.DodecahedronGeometry(0.2)]
    static mats = [new THREE.MeshPhongMaterial ({color:"grey"}), new THREE.MeshPhongMaterial]
    constructor(type, target, scene, tower, startPos) {
        this.type = type;
        this.target = target;
        this.parentTower = tower;
        this.targetLastPos = target.pos.clone();
        this.progress = 0;
        switch (type) {
            case 0: // Cannon
                this.damage = 20; //tmp value
                this.speed = 0.8;
                let offsetDirection = (new THREE.Vector2(startPos.x, startPos.z).sub(new THREE.Vector2(target.x, target.z))).normalize();
                this.curve = new THREE.CubicBezierCurve3(
                    startPos.clone(),
                    new THREE.Vector3(target.pos.x+offsetDirection.x, target.pos.y+1, target.pos.z+offsetDirection.y),
                    new THREE.Vector3(target.pos.x, target.pos.y+1, target.pos.z),
                    new THREE.Vector3(target.pos.x, target.pos.y, target.pos.z)
                )
                break;
            case 1: // Mage
                this.damage = 40; //tmp value
                this.speed = 0.3;
                this.curve = new THREE.LineCurve3(
                    startPos.clone(),
                    new THREE.Vector3(target.pos.x, target.pos.y, target.pos.z)
                )
                break;
        }
        this.scene = scene;
        this.mesh = new THREE.Mesh(Projectile.geos[type], Projectile.mats[type]);
        this.mesh.position.copy(startPos);
        scene.add(this.mesh);
        
        Projectile.list.push(this);
    }

    static update(dt) {
        Projectile.list.forEach((e)=>e.move(dt));
    }

    move(dt) {
        // if the target has been defeated by another entity, make the bullet end point be at y=0, to crash on the ground (cannon only)
        if (this.target == null && this.curve.v3.y != 0 && this.type == 0) {
            this.curve.v3.y = 0;
        }
        // update curve to take in account enemy movement
        switch (this.type) {
          case 0: // Cannon
            if (this.target != null) {
              let offSetPos = this.target.pos.clone().sub(this.targetLastPos);
              this.curve.v1.copy(this.target.pos);
              this.curve.v1.add(new THREE.Vector3(0, 1, 0));
              this.curve.v2.add(offSetPos);
              this.curve.v3.add(offSetPos);
              this.targetLastPos.copy(this.target.pos);
            }
            break;
          case 1: // Mage
            if (this.target != null) {
              this.curve.v2.copy(this.target.pos);
            }
            break;
        }
        this.progress += dt / this.speed;
        this.mesh.position.copy(this.curve.getPointAt(this.progress));
        // if target reached
        if (this.progress >= 1) {
            if (this.target) {
                let isDead = this.target.takedmg(this.damage);
                if (isDead == 0)
                    this.parentTower.targetKilled();
            }
            Projectile.list.splice(Projectile.list.indexOf(this), 1);
            this.scene.remove(this.mesh);
        }
    }
}