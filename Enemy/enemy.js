import {GLTFLoader} from "../GLTFLoader.js"
import * as THREE from "../three.module.js"

class Enemy{
  static index = 0;
  constructor(x, y, z, scene, checkpoints, speed, enemies =[]){
    this.internal_clock = 0.0;
    this.id = this.index;
    this.index++;
    this.model;
    this.scene = scene;
    this.speed = speed;
    this.enemies = enemies;
    this.loaded = false;
    this.pos = new THREE.Vector3(x, y, z);
    this.checkpoints = checkpoints.map((e)=> new THREE.Vector3(e.x, y, e.z));
    this.life = 1;
    this.direction = new THREE.Vector3();
    this.randVariation = Math.random();
  }
  animate(delta){
    this.internal_clock += delta;
    this.pos.setY(Math.sin(this.internal_clock * 5 * this.randVariation) * 0.025 + 0.35 );
    this.model.rotation.y += delta * this.randVariation;
  }
  move(delta){
    //if not loaded or no more checkpoints stop moving
    if (!this.loaded || this.checkpoints.length == 0)
      return ;
    this.animate(delta);
    this.direction.subVectors(this.checkpoints[0], this.pos).normalize();
    this.pos.addScaledVector(this.direction, delta * this.speed);
    if (this.pos.distanceTo(this.checkpoints[0]) < 0.1)
      this.checkpoints.shift();
    this.model.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
  takedmg(dmg){
    this.life -= dmg;
    if (this.life > 0)
      return 1;
    this.scene.remove(this.model);
    this.enemies[this.id] = null;
    return 0;
  }
}

class purpleEnemy extends Enemy{
  constructor(x, y, z, scene, checkpoints =[], enemies =[]){
    super(x, y, z, scene, checkpoints, 0.7, enemies);
    this.life = 100;
    this.loader = new GLTFLoader();
    this.loader.load("./Enemy/enemy_ufoPurple.glb",
      (gltf)=>{
        //change model coords
        this.model = gltf.scene;
        gltf.scene.position.setY(y);
        gltf.scene.scale.set(0.35, 0.35, 0.35);
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

class yellowEnemy extends Enemy{
  constructor(x, y, z, scene, checkpoints =[], enemies =[]){
    super(x, y, z, scene, checkpoints, 0.5, enemies);
    this.life = 200;
    this.loader = new GLTFLoader();
    this.loader.load("./Enemy/enemy_ufoYellow.glb",
      (gltf)=>{
        //change model coords
        this.model = gltf.scene;
        gltf.scene.position.setY(y);
        gltf.scene.scale.set(0.35, 0.35, 0.35);
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

let waves =[{//each object is a wave this is wave 0
    enemies:[[0, 1, 0],[1, 2, 1]],//which lane to spawn + type of enemy (0=no enemy, 1= purple, 2=yellow)
    timing:[0, 2]//time before next spawn
  },
  {//wave 1
    enemies:[[0, 1, 0],[1, 1, 1], [1, 2, 1]],
    timing:[0, 2, 2]
  },
  {//wave 2
    enemies:[[1, 1, 1], [1, 2, 1], [2, 0, 2], [2, 2, 2]],
    timing:[0, 2, 2, 3]
  }
];

export class Spawner{
  timer = 0.0;
  waveNumber = 0;
  constructor(scene, enemies, spawn, midCheckpoints, topCheckpoints, botCheckpoints){
    this.scene = scene;
    this.enemies = enemies;
    this.spawnPos = spawn;
    this.midCheckpoints = midCheckpoints;
    this.topCheckpoints = topCheckpoints;
    this.botCheckpoints = botCheckpoints;
  }
  spawnEnemy(enemyType, lane){
    if (enemyType == 0)
      return;
    let checkpoints;
    let spawnPos = new THREE.Vector3(this.spawnPos[0], this.spawnPos[1], this.spawnPos[2]);
    if (lane == 0){
      checkpoints = this.topCheckpoints;
      // spawnPos.x -= 0.25;
      spawnPos.z -= 0.4;
    }
    else if (lane == 1)
      checkpoints = this.midCheckpoints;
    else {
      checkpoints = this.botCheckpoints;
      // spawnPos.x -= 0.25;
      spawnPos.z += 0.4;
    }
    if(enemyType == 1)
      this.enemies.push(new purpleEnemy(...spawnPos, this.scene, checkpoints, this.enemies))
    else
      this.enemies.push(new yellowEnemy(...spawnPos, this.scene, checkpoints, this.enemies));
  }
  spawn(delta){
    //si plus de vague fin
    if (this.waveNumber >= waves.length)
      return ;
    this.timer += delta;
    //if wave over and 15s gone, send next wave
    if (!waves[this.waveNumber].timing.length && this.timer > 15){
      this.waveNumber++;
      this.timer = 0.0;
      return ;
    }
    if (this.timer > waves[this.waveNumber].timing[0]){
      this.spawnEnemy(waves[this.waveNumber].enemies[0][0], 0);
      this.spawnEnemy(waves[this.waveNumber].enemies[0][1], 1);
      this.spawnEnemy(waves[this.waveNumber].enemies[0][2], 2);
      waves[this.waveNumber].timing.shift();
      waves[this.waveNumber].enemies.shift();
      this.timer = 0.0;
    }
  }
}