import * as THREE from "../Addons/three.module.js";
import {GLTFLoader} from "three/addons/GLTFLoader.js";
import {FontLoader} from "three/addons/FontLoader.js";

export class Menu extends THREE.Scene {
    static pointer = new THREE.Vector2();
    static raycaster = new THREE.Raycaster();
    static camera = new THREE.PerspectiveCamera();
    constructor(scene, camera) {
        super().copy(scene);
        this.title = this.addButton("glassPanel_projection.png", "helvetiker_bold.typeface.json", camera, 1, 'Tower Defense', 1.15, 0.46, 0.004);
        this.playButton = this.addButton("grey_button05.png", "helvetiker_regular.typeface.json", camera, 0.5, 'Play Demo', 0.6, 0.32, 0.005);
        this.scenery = this.addScenery(camera);

        Menu.camera.copy(camera);
        this.buttonClicked = false;
    }

    addButton(textureName, font, camera, opacity, message, posY, width, textWidth) {
        let loader = new FontLoader();
        let texture = new THREE.TextureLoader().load("./Menu/"+textureName);
        const geometry = new THREE.PlaneGeometry(5, 1);
        const material = new THREE.MeshBasicMaterial( {map: texture} );
        material.transparent = true;

        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(THREE.MathUtils.degToRad(-45));
        plane.position.copy(camera.position);
        plane.translateZ(-2);
        plane.translateY(posY);
        plane.scale.setScalar(0.4);
        plane.scale.setX(width);
        this.add(plane);

        loader.load("./Menu/"+font, (font)=>{
            const color = "black";

            const matDark = new THREE.LineBasicMaterial( {
                color: color,
                side: THREE.DoubleSide
            } );

            const matLite = new THREE.MeshBasicMaterial( {
                color: color,
                transparent: true,
                opacity: opacity,
                side: THREE.DoubleSide
            } );

            const shapes = font.generateShapes( message, 100 );
            const geometry = new THREE.ShapeGeometry( shapes );
            geometry.computeBoundingBox();
            const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
            geometry.translate( xMid, 0, 0 );

            const text = new THREE.Mesh( geometry, matLite );
            text.translateZ(0.01);
            text.translateY(-0.17);
            text.scale.setScalar(0.004);
            text.scale.setX(textWidth);
            plane.add( text );
        });
        return plane;
    }

    addScenery(camera) {
        let map = new THREE.Group();
        map.position.copy(camera.position);
        map.translateY(-3);
        map.translateZ(-6);
        map.rotateX(THREE.MathUtils.degToRad(15));
        this.add(map);

        let offset = -4.5;
        let length = new THREE.Vector2(30, 12);
        let mapData = [ 0, 7, 7, 7, 1, 0, 9, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10, 7, 7, 0, 1, 9, 8, 9, 9,
                        0, 7, 7, 0, 1, 0, 9, 8,10,10,10,10,10,10,10,10,10,10,10,10,10,10, 7, 7, 0, 1, 8, 9, 9, 9,
                       10, 0, 7, 0, 1, 0, 9, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10, 7, 7, 0, 1, 9, 8, 9,10,
                       10,10, 7, 0, 1, 0, 0, 8, 9,10,10,10,10,10,10,10,10,10,10,10,10, 7, 7, 0, 0, 1, 8, 9,10,10,
                       10,10, 0, 0, 6, 2, 4, 8, 9,10,10,10,10,10,10,10,10,10,10,10,10, 7, 0, 5, 2, 3, 9, 8,10,10,
                       10,10,10, 0, 0, 0, 1, 0, 8, 8,10,10,10,10,10,10,10,10,10,10, 7, 7, 0, 1, 0, 0, 8,10,10,10,
                       10,10,10,10, 0, 0, 1, 0, 0, 7,10,10,10,10,10,10,10,10,10,10, 0, 0, 0, 1, 7, 0,10,10,10,10,
                       10,10,10,10,10, 0, 6, 2, 4, 0, 7,10,10,10,10,10,10,10,10, 0, 0, 5, 2, 3, 0,10,10,10,10,10,
                       10,10,10,10,10,10, 7, 0, 1, 0, 0, 0,10,10,10,10,10,10, 9, 8, 0, 1, 0, 0,10,10,10,10,10,10,
                       10,10,10,10,10,10,10, 0, 6, 2, 4, 0, 8, 9, 0, 0, 7, 9, 8, 5, 2, 3, 0,10,10,10,10,10,10,10,
                       10,10,10,10,10,10,10, 9, 9, 0, 6, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 9, 9,10,10,10,10,10,10,10,
                       10,10,10,10,10,10,10,10, 8, 9, 0, 7, 0, 0, 9, 0, 0, 7, 0, 8, 9, 8,10,10,10,10,10,10,10,10];

        this.loader = new GLTFLoader();
        this.loader.load("./Map/snow_tile.glb", (gltf) => {
          for (let z = 0; z < length.y; z++) {
            for (let x = 0; x < length.x; x++) {
              if (mapData[x + z*length.x] == 0) {
                let model = gltf.scene.clone();
                model.position.set((length.x/-2+0.5)+x, 0, (length.y/-2+0.5)+z);
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                map.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_straight.glb", (gltf) => {
          for (let z = 0; z < length.y; z++) {
            for (let x = 0; x < length.x; x++) {
              if (1 <= mapData[x + z*length.x] && mapData[x + z*length.x] <= 2) {
                let model = gltf.scene.clone();
                switch(mapData[x + z*length.x]) {
                  case 1:
                    break;
                  case 2:
                    model.rotateY(THREE.MathUtils.degToRad(90))
                    break;
                }
                model.position.set((length.x/-2+0.5)+x, 0, (length.y/-2+0.5)+z);
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                map.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_cornerSquare.glb", (gltf) => {
          for (let z = 0; z < length.y; z++) {
            for (let x = 0; x < length.x; x++) {
              if (3 <= mapData[x + z*length.x] && mapData[x + z*length.x] <= 6) {
                let model = gltf.scene.clone();
                switch(mapData[x + z*length.x]) {
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
                model.position.set((length.x/-2+0.5)+x, 0, (length.y/-2+0.5)+z);
                model.traverse((node)=>{
                  if (node.isMesh){
                    node.receiveShadow = true;
                    node.depthPacking = THREE.RGBADepthPacking;
                    node.material.roughness = 1.0;
                    node.material.metalness = 0.0;
                  }
                });
                map.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_rock.glb", (gltf) => {
          for (let z = 0; z < length.y; z++) {
            for (let x = 0; x < length.x; x++) {
              if (mapData[x + z*length.x] == 7) {
                let model = gltf.scene.clone();
                model.position.set((length.x/-2+0.5)+x, 0, (length.y/-2+0.5)+z);
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
                map.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_treeDouble.glb", (gltf) => {
          for (let z = 0; z < length.y; z++) {
            for (let x = 0; x < length.x; x++) {
              if (mapData[x + z*length.x] == 8) {
                let model = gltf.scene.clone();
                model.position.set((length.x/-2+0.5)+x, 0, (length.y/-2+0.5)+z);
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
                map.add(model);
              }
            }
          }
        });

        this.loader.load("./Map/snow_tile_treeQuad.glb", (gltf) => {
          for (let z = 0; z < length.y; z++) {
            for (let x = 0; x < length.x; x++) {
              if (mapData[x + z*length.x] == 9) {
                let model = gltf.scene.clone();
                model.position.set((length.x/-2+0.5)+x, 0, (length.y/-2+0.5)+z);
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
                map.add(model);
              }
            }
          }
        });
        return map;
    }

    interaction() {
        Menu.raycaster.setFromCamera(Menu.pointer, Menu.camera);
        let intersects = Menu.raycaster.intersectObjects(this.children);
        if (intersects.find((btn) => btn.object == this.playButton)) {
            this.playButton.scale.setScalar(0.45);
            this.playButton.scale.setX(0.34);
        }
        else {
            this.playButton.scale.setScalar(0.4);
            this.playButton.scale.setX(0.32);
        }
    }

    onPointerMove(event) {
        Menu.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	      Menu.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    onPointerUp(event) {
        Menu.raycaster.setFromCamera(Menu.pointer, Menu.camera);
        let intersects = Menu.raycaster.intersectObjects(this.children);
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object == this.playButton) {
                this.buttonClicked = true;
                this.remove(this.title);
                this.remove(this.playButton);
            }
        }
    }
}