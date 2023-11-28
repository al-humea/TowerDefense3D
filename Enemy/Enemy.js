import {GLTFLoader} from "../GLTFLoader.js"

class Enemy{
    constructor(x, y, checkpoints){
        this.x = x;
        this.y = y;
        this.checkpoints = checkpoints;
    }
}

export class purpleEnemy extends Enemy{
    constructor(x, y, checkpoints =[]){
        super(x, y, checkpoints);
    }
}