import * as THREE from "../Addons/three.module.js";

export class Lights{
  constructor(scene){
    const lights = [];
    lights.push(new THREE.AmbientLight(0xffffff, 0.3));
    lights.push(new THREE.DirectionalLight(0xffffff, 1.3));
    lights.push(new THREE.HemisphereLight(0xffffff,0xfffafa, 0.4));
    lights.forEach((x)=>{
      x.layers.enable(1);
      x.position.y = 4;
      x.position.z = 3;
      scene.add(x);
    });
  }
}
import {RenderPass} from "../Addons/postprocessing/RenderPass.js";
import {EffectComposer} from "../Addons/postprocessing/EffectComposer.js";
import {SSAOPass} from "../Addons/postprocessing/SSAOPass.js"
import {UnrealBloomPass} from "../Addons/postprocessing/UnrealBloomPass.js"
import {OutputPass} from "../Addons/postprocessing/OutputPass.js";
// import {FXAAShader} from "../Addons/postprocessing/FXAAShader.js"
import {ShaderPass} from "../Addons/postprocessing/ShaderPass.js";
export class Process{
  constructor(renderer, scene, camera){
    
    this.bloomComposer = new EffectComposer(renderer);
    let renderpass = new RenderPass(scene, camera);
    this.bloomComposer.addPass(renderpass);
    this.bloomComposer.addPass(new SSAOPass(scene, camera, window.innerWidth, window.innerHeight, 16));
    let bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      .3,
      .0,
      0.5
    );
    this.bloomComposer.addPass(bloomPass);
    this.bloomComposer.addPass(new OutputPass());
  }
}
