import * as THREE from "../Addons/three.module.js";
import {GLTFLoader} from "three/addons/GLTFLoader.js";
import {FontLoader} from "three/addons/FontLoader.js";

export class Menu extends THREE.Scene {
    static pointer = new THREE.Vector2();
    static raycaster = new THREE.Raycaster();
    static camera = new THREE.PerspectiveCamera();
    constructor(scene, camera) {
        super().copy(scene);
        let loader = new FontLoader();

        // Setup Title

        {
        let texture = new THREE.TextureLoader().load("./Menu/glassPanel_projection.png");
        const geometry = new THREE.PlaneGeometry(5, 1);
        const material = new THREE.MeshBasicMaterial( {map: texture} );
        material.transparent = true;

        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(THREE.MathUtils.degToRad(-45));
        plane.position.copy(camera.position);
        plane.translateZ(-2);
        plane.translateY(1.1);
        plane.scale.setScalar(0.4);
        plane.scale.setX(0.46);
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
                opacity: 1,
                side: THREE.DoubleSide
            } );

            const message = 'Tower Defense';
            const shapes = font.generateShapes( message, 100 );
            const geometry = new THREE.ShapeGeometry( shapes );
            geometry.computeBoundingBox();
            const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
            geometry.translate( xMid, 0, 0 );

            const text = new THREE.Mesh( geometry, matLite );
            text.rotateX(THREE.MathUtils.degToRad(-45));
            text.position.copy(camera.position);
            text.translateZ(-1.99);
            text.translateY(1);
            text.scale.setScalar(0.002);
            this.add( text );
        });
        }

        // Setup Play Button

        {
        let texture = new THREE.TextureLoader().load("./Menu/grey_button05.png");
        const geometry = new THREE.PlaneGeometry(5, 1);
        const material = new THREE.MeshBasicMaterial( {map: texture} );
        material.transparent = true;

        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(THREE.MathUtils.degToRad(-45));
        plane.position.copy(camera.position);
        plane.translateZ(-2);
        plane.translateY(0.4);
        plane.scale.setScalar(0.4);
        plane.scale.setX(0.32);
        this.add(plane);
        this.button = plane;

        loader.load("./Menu/helvetiker_bold.typeface.json", (font)=>{
            const color = "black";

            const matDark = new THREE.LineBasicMaterial( {
                color: color,
                side: THREE.DoubleSide
            } );

            const matLite = new THREE.MeshBasicMaterial( {
                color: color,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            } );

            const message = 'Play Demo';
            const shapes = font.generateShapes( message, 100 );
            const geometry = new THREE.ShapeGeometry( shapes );
            geometry.computeBoundingBox();
            const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
            geometry.translate( xMid, 0, 0 );

            const text = new THREE.Mesh( geometry, matLite );
            text.rotateX(THREE.MathUtils.degToRad(-45));
            text.position.copy(camera.position);
            text.translateZ(-1.99);
            text.translateY(0.3);
            text.scale.setScalar(0.002);
            this.add( text );
        });
        }
        Menu.camera.copy(camera);
        this.buttonClicked = false;
    }

    interaction() {
        Menu.raycaster.setFromCamera(Menu.pointer, Menu.camera);
        let intersects = Menu.raycaster.intersectObjects(this.children);
        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object == this.button) {
                    intersects[i].object.scale.setScalar(0.45);
                    intersects[i].object.scale.setX(0.34);
                }
            }
        }
        else {
            this.button.scale.setScalar(0.4);
            this.button.scale.setX(0.32);
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
            if (intersects[i].object == this.button) {
                this.buttonClicked = true;
            }
        }
    }
}