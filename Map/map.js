import * as THREE from '../three.module.js'

/*
export class Map {

  constructor(scene) {
    this.scene = scene;
    this.tiles = [];
  }

  async init() {

    // Load tile assets asynchronously
    await this.loadTiles(); 

    // Cache tile geometries
    this.createTileGeometries();

    // Add tiles to scene once loaded
    this.addTilesToScene();
  }

  // Map data
  mapData = [
    [0, 1, 0],
    [1, 2, 1],
    [0, 1, 0] 
  ];

  // Tile types
  tileTypes = {
    0: 'snow',
    1: 'snowSquare',
    2: 'snowStraight'
  };

  async loadTiles() {
    this.tiles = await Promise.all(
      Object.values(this.tileTypes).map(type => {
        return this.loadTile(type)  
      })
    );
  }

  async loadTile(type) {
    return new THREE.GLTFLoader().load(`${type}.glb`, this.scene);
  }

createTileGeometries() {
  this.tiles.forEach(tile => {
    tile.geometry = new THREE.BufferGeometry().fromGeometry(tile.geometry);
  });
}
  addTilesToScene() {

    for (let y = 0; y < this.mapData.length; y++) {
      for (let x = 0; x < this.mapData[y].length; x++) {

        const tile = this.getTile(this.mapData[y][x]);

        // Add to container for batch update
        this.tilesContainer.add(tile);

      }
    }

    // Add container to scene
    this.scene.add(this.tilesContainer);

  }

  get spawn() {
    return this.tiles[0].position;
  }

  getTile(type) {
    return this.tiles[this.tileTypes[type]];
  }

}

*/


// // Checkpoints ici ou bien dans d
// export class Map {
// // Map data 
// const mapData = [
//   [0, 0, 0, 1, 0],
//   [1, 1, 2, 2, 1], 
//   [0, 0, 0, 0, 0]
// ];

// // Tiles
// const tileTypes = {
//   0: 'snow_tile',
//   1: 'snow_tile_cornerSquare',
//   2: 'snow_tile_straight'
// };

//   constructor(scene) {

//     this.scene = scene;

//     // Array to hold tile mesh objects
//     this.tiles = []; 

//     // Spawn 
//     this.spawn = [0, 0, 0]; 

//     // taille des tiles et grid
//     const tileWidth = 1;
//     const tileHeight = 1;
//     const gridWidth = 10;
//     const gridHeight = 10;

//     for(let i = 0; i < gridHeight; i++) {
//       for(let j = 0; j < gridWidth; j++) {

//   for(let i = 0; i < gridHeight; i++) {
//     for(let j = 0; j < gridWidth; j++) {

//       // Get tile type 
//       const type = tileTypes[mapData[i][j]];
//       const tile = this.createTile(type);

//         // Position des tiles
//         tile.position.x = j * tileWidth - (gridWidth/2) * tileWidth; 
//         tile.position.z = i * tileHeight - (gridHeight/2) * tileHeight;

//         // Add dans la scene
//         this.scene.add(tile);

//         // Save 
//         this.tiles.push(tile);

//       }
//     }

//     // Set au spawn et checkpoints si besoin?
//     this.spawn = this.tiles[0].position;

//     );

//   }

//   createTile(type) {

//     // Loading des fichiers 3D glb 
//     let tile;
//     switch(type) {
//       case 'snow_tile':
//         tile = new THREE.GLTFLoader().load('snow_tile.glb', scene); 
//         break;

//       case 'snow_tile_cornerSquare': 
//         tile = new THREE.GLTFLoader().load('snow_tile_cornerSquare.glb', scene);
//         break;

//       case 'snow_tile_straight':
//         tile = new THREE.GLTFLoader().load('snow_tile_straight.glb', scene);
//         break;
//     }

//     return tile;

//   }

//   // Getters
//   get spawn() {
//     return this.spawn;
//   }

// }




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
}
