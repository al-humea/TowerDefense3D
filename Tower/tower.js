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
-> update(dt, enemies) -> s'occupe d'updater toutes les tours
- targetCheck(dt, enemies) -> s'occupe de check / visé un ennemi

-- Class MageTower extends Tower
- loader
-> update(dt) -> s'occupe d'updater toutes les tours
- targetCheck(dt) -> s'occupe de check / visé un ennemi


-- Class Projectile
- [static] Liste des Projectiles
- [static] Liste des Matériaux pour les différents projectiles
- Type projectile (0 -> Cannon, 1 -> Mage)
- Cible
- Courbe bézier (cubic pour cannon, linear pour mage)
- Progression à la cible (0 -> 1)
- Vitesse projectile (temps en seconde pour atteindre la cible)
- Dégâts
- progress(dt) -> progression vers la cible
- hit() -> S'occupe de supprimé le projectile, et fait le nécéssaire avec la cible

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
            if (this.cooldown >= this.maxCooldown) {
                // construct projectile and "shoot"
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
        let geo = new THREE.DodecahedronGeometry(0.2);
        let mat = new THREE.MeshStandardMaterial({color:"white"});
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
            if (this.cooldown >= this.maxCooldown) {
                // construct projectile and "shoot"
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

class Projectile {
    constructor(type, target, startPos) {

    }
}