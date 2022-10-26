import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { preloadFont } from "troika-three-text";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";

import * as Settings from "./constants.js";
import Characters from "./sceneSubjects/Characters.js";
import Particles from "./sceneSubjects/Particles.js";
import GeneralLight from "./sceneSubjects/GeneralLight.js";
import Temple from "./sceneSubjects/Temple.js";
import SpeechBubble from "./sceneSubjects/SpeechBubble.js";

const stats = Stats();

const clock = new THREE.Clock();
let previousTime = 0;

class SceneManager {
  constructor(canvas) {
    this.scene = new THREE.Scene();
    this.renderer = this.buildRenderer(canvas);
    this.effect = new OutlineEffect(this.renderer, {
      defaultThickness: 0.01,
      defaultColor: [0, 0, 0],
      defaultAlpha: 0.8,
      defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
    });
    this.camera = this.buildCamera();
    this.loadingManager = new THREE.LoadingManager();

    const color = 0x000000;
    const density = 0.01;
    this.scene.fog = new THREE.FogExp2(color, density);

    this.sceneSubjects = this.createSceneSubjects();

    this.preloadModels(this.loadingManager);

    this.loadingManager.onLoad = () => {
      preloadFont(
        {
          font: "/fonts/PermanentMarker.ttf"
        },
        () => {
          console.log("loaded");
          const loadingScreen = document.getElementById("loading-screen");
          loadingScreen.classList.add("fade-out");

          // optional: remove loader from DOM via event listener
          loadingScreen.addEventListener("transitionend", (event) => {
            event.target.remove();
          });

          this.animateCameraInitialState();
        }
      );
    };
  }

  preloadModels(loadingManager) {
    this.temple.setTemple(this.scene, loadingManager);
  }

  buildRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });

    renderer.setSize(Settings.SCREEN_SIZES.width, Settings.SCREEN_SIZES.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(stats.dom);

    return renderer;
  }

  buildCamera() {
    // Base camera
    const fieldOfView = Settings.CAMERA_FOV;
    const aspectRatio =
      Settings.SCREEN_SIZES.width / Settings.SCREEN_SIZES.height;
    const nearPlane = 0.1;
    const farPlane = 1000;

    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    this.cameraGroup = new THREE.Group();
    this.scene.add(this.cameraGroup);

    camera.position.set(0, 5, 60);

    this.cameraGroup.add(camera);

    // let controls = new OrbitControls(camera, this.renderer.domElement);
    // camera.position.set(0, 30, 30);
    // controls.update();

    return camera;
  }

  createSceneSubjects() {
    const format = this.renderer.capabilities.isWebGL2
      ? THREE.RedFormat
      : THREE.LuminanceFormat;

    this.particles = new Particles(this.scene, 500, 50);
    this.characters = new Characters(this.scene, format, "#ffffff");
    this.temple = new Temple(this.scene, format);
    this.speechBubble = new SpeechBubble(
      this.scene,
      format,
      "Isichros, I summon thee."
    );
    this.light = new GeneralLight(this.scene, "#ffe1bd");

    // add new SceneSubjects to the scene
    const sceneSubjects = [this.particles, this.characters, this.light];

    return sceneSubjects;
  }

  update(cursor) {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Animate camera
    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;

    this.cameraGroup.position.x +=
      (parallaxX - this.cameraGroup.position.x) * 5 * deltaTime;
    this.cameraGroup.position.y +=
      (parallaxY - this.cameraGroup.position.y) * 5 * deltaTime;

    // Animate particles
    this.particles.update();

    // Animate characters
    this.characters.update();

    // Animate characters
    this.speechBubble.update();

    // Animate light
    this.light.update();

    this.effect.render(this.scene, this.camera);

    stats.update();
  }

  onWindowResize() {
    // update sizes when a resize event occurs
    Settings.SCREEN_SIZES.width = window.innerWidth;
    Settings.SCREEN_SIZES.height = window.innerHeight;

    // update camera
    this.camera.aspect =
      Settings.SCREEN_SIZES.width / Settings.SCREEN_SIZES.height;
    this.camera.updateProjectionMatrix();

    // update renderer
    this.renderer.setSize(
      Settings.SCREEN_SIZES.width,
      Settings.SCREEN_SIZES.height
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /* ---------- */
  /* ANIMATIONS */
  /* ---------- */

  animateCameraInitialState() {
    gsap.timeline().to(this.camera.position, {
      x: 0,
      y: 1.3,
      z: 5,
      duration: 4,
      ease: "power4.inOut"
    });
  }

  animateMortalMove() {
    gsap.timeline().to(this.characters.mortalMesh.position, {
      x: "+=2",
      y: "+=0",
      z: "+=0",
      duration: 2,
      ease: "power4.inOut",
      onUpdate: () => {
        this.characters.mortalMesh.updateMatrix();
      }
    });
  }

  animateSpeechBubble() {
    gsap.timeline().to(this.speechBubble.text, {
      fillOpacity: 1,
      duration: 2,
      ease: "power4.inOut",
      onUpdate: () => {
        this.characters.mortalMesh.updateMatrix();
      }
    });
  }
}

export default SceneManager;
