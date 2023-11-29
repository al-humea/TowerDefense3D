import * as THREE from '../three.module.js'

export class Map {
    planeGeo = new THREE.PlaneGeometry(0.90, 0.90, 10, 10);
    planeWhiteMat = new THREE.MeshStandardMaterial ({color:"white"});
    planeRedMat = new THREE.MeshStandardMaterial ({color:"grey"});
    planeList = [];
    checkpoints = [];
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
                this.scene.add(this.plane);
                this.planeList.push(this.plane);
            }
        }
        this.spawn = this.planeList[80].position;
        this.checkpoints = [this.planeList[87].position, this.planeList[47].position,
                            this.planeList[42].position, this.planeList[12].position,
                            this.planeList[19].position];
    }
    get spawn(){
        return (this.spawn);
    }
    get checkpoints(){
        return (this.checkpoints);
    }
}