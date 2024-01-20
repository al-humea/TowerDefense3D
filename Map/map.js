import {GLTFLoader} from "../Addons/GLTFLoader.js";
import * as THREE from '../Addons/three.module.js'

export class Map {
    planeGeo = new THREE.PlaneGeometry(0.90, 0.90, 10, 10);
    planeWhiteMat = new THREE.MeshStandardMaterial ({color:"white"});
    planeRedMat = new THREE.MeshStandardMaterial ({color:"grey"});
    planeList = [];
    spawn = [0, 0];
    constructor(scene){
        this.scene = scene;
        this.plane = null;
        for (let i = 0; i < 10; i++){
            for (let j = 0; j < 10; j++){
                if ((i == 8 && j < 8) || (i < 8 && i > 3 && j == 7)||
                    (i == 4 && j < 8 && j >1) || (j==2 && i > 0 && i < 4)||
                    (i == 1 && j > 1))
                    this.plane = new THREE.Mesh(this.planeGeo, this.planeRedMat);
                else this.plane = new THREE.Mesh(this.planeGeo, this.planeWhiteMat);
                this.plane.position.x = -4.5 + j;
                this.plane.position.z = 2.5 - i;
                this.plane.rotation.x = THREE.MathUtils.degToRad(-90);
                this.plane.receiveShadow = true;
                //this.scene.add(this.plane);
                this.planeList.push(this.plane);
            }
        }
        this.spawn = this.planeList[80].position;
        this.checkpoints = [this.planeList[87].position, this.planeList[47].position,
                            this.planeList[42].position, this.planeList[12].position,
                            this.planeList[19].position];

        let mapData = [0, 0, 0, 0, 0, 0, 8, 8, 9, 9,
                       2, 2, 2, 2, 2, 2, 2, 4, 8, 8,
                       7, 0, 0, 0, 0, 0, 0, 1, 0, 8,
                       9, 8, 0, 7, 9, 0, 7, 1, 0, 0,
                       7, 0, 0, 0, 8, 0, 0, 1, 0, 0,
                       0, 0, 5, 2, 2, 2, 2, 3, 0, 8,
                       8, 8, 1, 0, 0, 7, 0, 0, 7, 9,
                       9, 8, 1, 0, 0, 0, 0, 0, 9, 8,
                       9, 0, 6, 2, 2, 2, 2, 2, 2, 2,
                       9, 8, 0, 7, 0, 0, 0, 7, 0, 0]

        
        let offsetY = -0.2;
        this.loader = new GLTFLoader();
        this.loader.load("./Map/snow_tile.glb",
        function (gltf){
          for (let z = 0; z < 10; z++) {
            for (let x = 0; x < 10; x++) {
              if (mapData[x + z*10] == 0) {
                let model = gltf.scene.clone();
                model.position.set(-4.5+x, offsetY, -6.5+z);
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                scene.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_straight.glb",
        function (gltf){
          for (let z = 0; z < 10; z++) {
            for (let x = 0; x < 10; x++) {
              if (1 <= mapData[x + z*10] && mapData[x + z*10] <= 2) {
                let model = gltf.scene.clone();
                switch(mapData[x + z*10]) {
                  case 1:
                    break;
                  case 2:
                    model.rotateY(THREE.MathUtils.degToRad(90))
                    break;
                }
                model.position.set(-4.5+x, offsetY, -6.5+z);
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                scene.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_cornerSquare.glb",
        function (gltf){
          for (let z = 0; z < 10; z++) {
            for (let x = 0; x < 10; x++) {
              if (3 <= mapData[x + z*10] && mapData[x + z*10] <= 6) {
                let model = gltf.scene.clone();
                switch(mapData[x + z*10]) {
                  case 3:
                    break;
                  case 4:
                    model.rotateY(THREE.MathUtils.degToRad(90))
                    break;
                  case 5:
                    model.rotateY(THREE.MathUtils.degToRad(180))
                    break;
                  case 6:
                    model.rotateY(THREE.MathUtils.degToRad(270))
                    break;
                }
                model.position.set(-4.5+x, offsetY, -6.5+z);
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                scene.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_rock.glb",
        function (gltf){
          for (let z = 0; z < 10; z++) {
            for (let x = 0; x < 10; x++) {
              if (mapData[x + z*10] == 7) {
                let model = gltf.scene.clone();
                model.position.set(-4.5+x, offsetY, -6.5+z);
                //shadow casting on scene
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                scene.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_treeDouble.glb",
        function (gltf){
          for (let z = 0; z < 10; z++) {
            for (let x = 0; x < 10; x++) {
              if (mapData[x + z*10] == 8) {
                let model = gltf.scene.clone();
                model.position.set(-4.5+x, offsetY, -6.5+z);
                //shadow casting on scene
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                scene.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_treeQuad.glb",
        function (gltf){
          for (let z = 0; z < 10; z++) {
            for (let x = 0; x < 10; x++) {
              if (mapData[x + z*10] == 9) {
                let model = gltf.scene.clone();
                model.position.set(-4.5+x, offsetY, -6.5+z);
                //shadow casting on scene
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                scene.add(model);
              }
            }
          }
        });
    }
    get spawn(){
        return (this.spawn);
    }
}
