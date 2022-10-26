import * as THREE from "three";
import { gsap } from "gsap";

class GeneralLight {
  constructor(scene, color) {
    this.container = new THREE.Group();
    this.container.matrixAutoUpdate = false;

    this.setGeneralLight(scene, color);
  }

  setGeneralLight(scene, color) {
    this.mesh = this.createGeneralLight(4, 2, -8, color);
    this.container.add(this.mesh);

    scene.add(this.container);
  }

  createGeneralLight(x, y, z, color) {
    const light = new THREE.PointLight(color, 1, 80, 2);
    light.position.set(x, y, z);

    return light;
  }

  update() {
    const timer = Date.now() * 0.00005;

    this.mesh.position.x = Math.sin(timer * 12) * 8;
    this.mesh.position.y = Math.cos(timer * 8) * 6;
    this.mesh.position.z = Math.cos(timer * 4) * 4;
  }
}

export default GeneralLight;
