/*
TODO :
-- Class 
- [static] Scale global
- Position dans la grille
- Cooldown
- MaxCooldown
- Portée
- Cible

-- Class CannonTower extends Tower
- loader
- scene
- cannon
-> update(dt, enemies) -> s'occupe d'updater toutes les tours
- targetCheck(dt, enemies) -> s'occupe de check / visé un ennemi

-- Class MageTower extends Tower
- loader
- scene
-> update(dt) -> s'occupe d'updater toutes les tours
- targetCheck(dt) -> s'occupe de check / visé un ennemi


-- Class Projectile
- [static] Liste des Projectiles
- [static] Liste des géométries pour les différents projectiles
- [static] Liste des Matériaux pour les différents projectiles
- Type projectile (0 -> Cannon, 1 -> Mage)
- Mesh
- Cible
- Courbe bézier (cubic pour cannon, linear pour mage)
- Progression à la cible (0 -> 1)
- Vitesse projectile (temps en seconde pour atteindre la cible)
- Dégâts
- update(dt) -> progression vers la cible

*/

import {GLTFLoader} from "../GLTFLoader.js";
import * as THREE from "../three.module.js";

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
                    if (node.isMesh) node.castShadow = true;
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
                    if (node.isMesh) node.castShadow = true;
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
        this.targetCheck(dt, enemies);
    }

    targetCheck(dt, enemies) {
        // if already got target
        if (this.target) {
            // fire when cooldown is up
            if (this.cooldown >= this.maxCooldown) {
                let offsetDirection = (new THREE.Vector2(this.target.x, this.target.z).sub(new THREE.Vector2(this.pos.x, this.pos.y))).normalize();
                let fireProjectile = new Projectile(0, this.target, this.scene, new THREE.Vector3(this.pos.x + offsetDirection.x*0.2,
                                                                                      0.8,
                                                                                      this.pos.y + offsetDirection.y*0.2));
            }
            // rotate the cannon in direction to the target
            this.cannon.lookAt(this.cannon.position.x + (this.cannon.position.x-this.target.position.x),
                               this.cannon.position.y,
                               this.cannon.position.z + (this.cannon.position.z-this.target.position.z));
        }
        // else, search for target within range
        else {
            enemies.some(enemy => {
                if ((this.pos.distanceTo(new THREE.Vector2(enemy.x, enemy.y))) < this.range) {
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
                    if (node.isMesh) node.castShadow = true;
                });
                //add model to scene
                scene.add(gltf.scene);
        });
        // bullet visible even before firing, "growing" above the tower depending of its cooldown
        let geo = Projectile.geos[1];
        let mat = Projectile.mats[1];
        this.bullet = new THREE.Mesh(geo, mat);
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
            this.bullet.geometry.radius = (this.cooldown-1)*0.2;
        else
            this.bullet.geometry.radius = 0;

        // check for target
        this.targetCheck(dt, enemies);
    }

    targetCheck(dt, enemies) {
        // if already got target
        if (this.target) {
            // fire when cooldown is up
            if (this.cooldown >= this.maxCooldown) {
                let fireProjectile = new Projectile(0, this.target, this.scene, new THREE.Vector3(this.pos.x, 1.85, this.pos.y));
            }
        }
        // else, search for target within range
        else {
            enemies.some(enemy => {
                if ((this.pos.distanceTo(new THREE.Vector2(enemy.x, enemy.y))) < this.range) {
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
    static mats = [new THREE.MeshStandardMaterial ({color:"black"}), new THREE.MeshStandardMaterial ({color:"white"})]
    constructor(type, target, scene, startPos) {
        this.type = type;
        this.target = target;
        this.progress = 0;
        switch (type) {
            case 0: // Cannon
                this.damage = 10; //tmp value
                this.speed = 1;
                let offsetDirection = (new THREE.Vector2(startPos.x, startPos.z).sub(new THREE.Vector2(target.x, target.z))).normalize();
                this.curve = new THREE.CubicBezierCurve3(
                    new THREE.Vector3(startPos),
                    new THREE.Vector3(target.x+offsetDirection.x, target.y+1, target.z+offsetDirection.y),
                    new THREE.Vector3(target.x, target.y+1, target.z),
                    new THREE.Vector3(target.x, target.y, target.z)
                )
                break;
            case 1: // Mage
                this.damage = 20; //tmp value
                this.speed = 0.5;
                this.curve = new THREE.LineCurve3(
                    new THREE.Vector3(startPos),
                    new THREE.Vector3(target.x, target.y, target.z)
                )
                break;
        }
        this.scene = scene;
        this.mesh = new THREE.Mesh(Projectile.geos[type], Projectile.mats[type]);
        this.mesh.position.set(startPos);
        this.scene.add(this.mesh);

        Projectile.list.push(this);
    }

    update(dt) {
        // if the target has been defeated by another entity, make the bullet end point be at y=0, to crash on the ground (cannon only)
        if (target == null && this.curve.v3.y != 0 && this.type == 0) {
            this.curve.v3.y = 0;
        }
        this.progress += dt / this.speed;
        this.mesh.position.set(this.curve.getPointAt(this.progress));
        // if target reached
        if (this.progress >= 1) {
            if (this.target)
                // target.hit(this.damage) ?
                Projectile.list.splice(Projectile.list.indexOf(this), 1);
                this.scene.remove(this.mesh);
        }
    }
}