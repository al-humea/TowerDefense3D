import * as THREE from "../Addons/three.module.js";
import {GLTFLoader} from "three/addons/GLTFLoader.js";
import {FontLoader} from "three/addons/FontLoader.js";

export class Menu extends THREE.Scene {
    static pointer = new THREE.Vector2();
    static raycaster = new THREE.Raycaster();
    static camera = new THREE.PerspectiveCamera();
    constructor(scene, camera) {
        super().copy(scene);
        this.title = this.addButton("glassPanel_projection.png", camera, 1, 'Tower Defense', 1.1, 0.46, 0.004);
        this.playButton = this.addButton("grey_button05.png", camera, 0.5, 'Play Demo', 0.4, 0.32, 0.005);

        Menu.camera.copy(camera);
        this.buttonClicked = false;
    }

    addButton(textureName, camera, opacity, message, posX, width, textWidth) {
        let loader = new FontLoader();
        let texture = new THREE.TextureLoader().load("./Menu/"+textureName);
        const geometry = new THREE.PlaneGeometry(5, 1);
        const material = new THREE.MeshBasicMaterial( {map: texture} );
        material.transparent = true;

        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(THREE.MathUtils.degToRad(-45));
        plane.position.copy(camera.position);
        plane.translateZ(-2);
        plane.translateY(posX);
        plane.scale.setScalar(0.4);
        plane.scale.setX(width);
        this.add(plane);

        loader.load("./Menu/helvetiker_bold.typeface.json", (font)=>{
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
            text.translateY(-0.15);
            text.scale.setScalar(0.004);
            text.scale.setX(textWidth);
            plane.add( text );
        });
        return plane;
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