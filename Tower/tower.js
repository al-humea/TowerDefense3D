/*
TODO :
-- Class 
- [static] Liste des tours
- [static] Scale global
- Position dans la grille
- Cooldown
- MaxCooldown
- Portée

-- Class CannonTower extends Tower
- loader
-> update(dt) -> s'occupe d'updater toutes les tours
- targetCheck(dt) -> s'occupe de check / visé un ennemi

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
    static scale = 0.95;
    constructor(x, z, cd, range) {
        this.pos = new THREE.Vector2(x, z);
        this.cooldown = 0;
        this.maxCooldown = cd;
        this.range = range;
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
    }
}

class Projectile {
    constructor(type, target, startPos) {

    }
}