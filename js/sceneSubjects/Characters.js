import * as THREE from "three";
import { gsap } from "gsap";

import * as Settings from "../constants.js";

class Characters {
  constructor(scene, format, color) {
    this.container = new THREE.Group();
    this.container.matrixAutoUpdate = false;

    this.setCharacters(scene, format, color);
  }

  setCharacters(scene, format, color) {
    this.mortalMesh = this.createMortal(format);
    this.container.add(this.mortalMesh);

    this.mortalMesh.position.x = -3;
    this.mortalMesh.position.y = -0.28;
    this.mortalMesh.position.z = -6;

    this.mortalMesh.rotation.y = 0.3;

    this.mortalMesh.updateMatrix();

    this.godMesh = this.createGod(format);
    this.container.add(this.godMesh);

    scene.add(this.container);
  }

  createMortal(format) {
    const container = new THREE.Group();
    container.matrixAutoUpdate = false;

    // Mortal Body
    const mortalBodyGeometry = new THREE.BoxBufferGeometry(0.3, 1, 0.3);
    const mortalBodyMaterial = new THREE.MeshToonMaterial({
      color: "#14611f",
      gradientMap: Settings.createGradientMap(format, 8)
    });
    const mortalBodyMesh = new THREE.Mesh(
      mortalBodyGeometry,
      mortalBodyMaterial
    );

    container.add(mortalBodyMesh);

    // Mortal Head
    const mortalHeadGeometry = new THREE.SphereBufferGeometry(0.25, 64, 64);
    const mortalHeadMaterial = new THREE.MeshToonMaterial({
      color: "#7df58e",
      gradientMap: Settings.createGradientMap(format, 8)
    });
    const mortalHeadMesh = new THREE.Mesh(
      mortalHeadGeometry,
      mortalHeadMaterial
    );

    mortalHeadMesh.position.y = 0.8;

    container.add(mortalHeadMesh);

    return container;
  }

  createGod(format) {
    const container = new THREE.Group();
    container.matrixAutoUpdate = false;

    // God Body
    const godBodyGeometry = new THREE.BoxBufferGeometry(0.3, 1, 0.3);
    const godMaterial = new THREE.MeshToonMaterial({
      color: "#560e75",
      gradientMap: Settings.createGradientMap(format, 8)
    });
    const godBodyMesh = new THREE.Mesh(godBodyGeometry, godMaterial);

    godBodyMesh.position.x = 1;
    godBodyMesh.position.y = -0.28;
    godBodyMesh.position.z = -6;

    godBodyMesh.rotation.y = -0.3;

    container.add(godBodyMesh);

    // God Head
    const godHeadGeometry = new THREE.ConeBufferGeometry(0.25, 0.5, 3);
    const godHeadMaterial = new THREE.MeshToonMaterial({
      color: "#d073fa",
      gradientMap: Settings.createGradientMap(format, 8)
    });
    const godHeadMesh = new THREE.Mesh(godHeadGeometry, godHeadMaterial);

    godHeadMesh.position.x = 1;
    godHeadMesh.position.y = 0.5;
    godHeadMesh.position.z = -6;

    container.add(godHeadMesh);

    return container;
  }

  update() {}
}

export default Characters;
