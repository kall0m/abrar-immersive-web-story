import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";

import * as Settings from "../constants.js";

class Temple {
  constructor(scene, format) {
    this.scene = scene;
    this.format = format;

    this.container = new THREE.Group();
    this.container.matrixAutoUpdate = false;

    //this.setTemple(scene, format);
  }

  setTemple(scene, loadingManager) {
    // this.wallMaterial = new THREE.MeshToonMaterial({
    //   color: "#a67ebb",
    //   gradientMap: Settings.createGradientMap(format, 8)
    // });
    // this.mesh = this.createTemple();
    // this.container.add(this.mesh);
    // scene.add(this.container);

    const loader = new GLTFLoader(loadingManager);

    loader.load(
      "../../models/temple-2/scene.gltf",
      function (gltf) {
        // temple 1
        // gltf.scene.scale.set(0.01, 0.01, 0.01);
        // gltf.scene.position.set(0, -2, 0);

        // temple 2
        gltf.scene.scale.set(0.06, 0.06, 0.06);
        gltf.scene.position.set(14.5, -29, -1);
        gltf.scene.rotation.set(0, 0.7, 0);

        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  createTemple() {
    const container = new THREE.Group();
    container.matrixAutoUpdate = false;

    const backWall = this.createWall(15, 8, 0.4, 0, 3, -7);
    container.add(backWall);

    const floor = this.createWall(15, 3, 0.4, 0, -1, -5.7, Math.PI / 2, 0, 0);
    container.add(floor);

    return container;
  }

  createWall(w, h, d, px = 0, py = 0, pz = 0, rx = 0, ry = 0, rz = 0) {
    const wallGeometry = new THREE.BoxBufferGeometry(w, h, d);
    const wallMesh = new THREE.Mesh(wallGeometry, this.wallMaterial);

    wallMesh.position.x = px;
    wallMesh.position.y = py;
    wallMesh.position.z = pz;

    wallMesh.rotation.x = rx;
    wallMesh.rotation.y = ry;
    wallMesh.rotation.z = rz;

    return wallMesh;
  }

  update() {}
}

export default Temple;
