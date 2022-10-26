import * as THREE from "three";
import { Text } from "troika-three-text";

import * as SimplexNoise from "simplex-noise";
import * as Settings from "../constants.js";

// Bubble Shaders
const BUBBLE_VERTEX_SHADER = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;
const BUBBLE_FRAGMENT_SHDAER = `
uniform vec3 color1;
uniform vec3 color2;

varying vec2 vUv;

void main() {
    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
}
`;

const speed = 8;
const processing = 1;
const spikes = 0.5;

class SpeechBubble {
  constructor(scene, format, text) {
    this.text = text;
    this.noise4D = SimplexNoise.createNoise4D();

    this.container = new THREE.Group();
    this.container.matrixAutoUpdate = false;

    this.setSpeechBubble(scene, format);
    this.setText(1, 10);

    this.container.position.x = -1.2;
    this.container.position.y = 1.5;
    this.container.position.z = -6.5;
    this.container.updateMatrix();

    scene.add(this.container);
  }

  setSpeechBubble(scene, format) {
    this.mesh = this.createSpeechBubble(format);
    this.container.add(this.mesh);
  }

  createSpeechBubble(format) {
    const bubbleGeometry = new THREE.CircleGeometry(1, 128, 6, 6.3);
    //const bubbleGeometry = new THREE.SphereBufferGeometry(0.25, 64, 64);
    const bubbleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color("#e3cb7d")
        },
        color2: {
          value: new THREE.Color("#fff5d4")
        }
      },
      vertexShader: BUBBLE_VERTEX_SHADER,
      fragmentShader: BUBBLE_FRAGMENT_SHDAER
    });
    // const bubbleMaterial = new THREE.MeshToonMaterial({
    //   color: "#fff5d4",
    //   gradientMap: Settings.createGradientMap(format, 8)
    // });

    return new THREE.Mesh(bubbleGeometry, bubbleMaterial);
  }

  setText(width, height) {
    const title = new Text();

    title.text = this.text.toUpperCase();

    title.font = "../../fonts/PermanentMarker.ttf";
    title.color = "#000000";
    title.textAlign = "center";
    title.fontSize = width * 0.1;

    title.maxWidth = 1;
    title.anchorX = "center";
    title.anchorY = "middle";

    title.fillOpacity = 0;

    title.depthOffset = -1;

    title.sync();

    this.text = title;
    this.container.add(this.text);
  }

  update() {
    const time = performance.now() * 0.00001 * speed * Math.pow(processing, 3);

    const position = this.mesh.geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);

      vertex
        .normalize()
        .multiplyScalar(
          0.6 +
            0.2 *
              this.noise4D(
                vertex.x * spikes,
                vertex.y * spikes,
                vertex.z * spikes + time,
                3
              )
        );

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);

      this.text.position.x = Math.cos(time * 8) * 0.06;
      this.text.position.y = Math.cos(time * 8) * 0.06;
    }

    this.mesh.geometry.computeVertexNormals();
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.attributes.normal.needsUpdate = true;
  }
}

export default SpeechBubble;
