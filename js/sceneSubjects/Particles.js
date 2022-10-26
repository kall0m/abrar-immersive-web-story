import * as THREE from "three";
import { gsap } from "gsap";

class Particles {
  constructor(scene, particlesCount, objectsDistance) {
    this.container = new THREE.Group();
    this.container.matrixAutoUpdate = false;

    this.setParticles(scene, particlesCount, objectsDistance);
  }

  setParticles(scene, particlesCount, objectsDistance) {
    this.particles = this.createParticles(particlesCount, objectsDistance);
    this.container.add(this.particles);

    this.particles.position.z = -18;

    this.changeSize();

    scene.add(this.container);
  }

  createParticles(particlesCount, objectsDistance) {
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * objectsDistance;
      positions[i * 3 + 1] =
        objectsDistance * 0.5 - Math.random() * objectsDistance;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    // Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      color: "#ffeded",
      sizeAttenuation: true,
      size: 0.03
    });

    return new THREE.Points(particlesGeometry, particlesMaterial);
  }

  changeSize() {
    gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(this.particles.material, {
        size: 0.02,
        duration: 2,
        ease: "elastic.inOut(1,0.6)"
      })
      .to(this.particles.material, {
        size: 0.04,
        duration: 2,
        ease: "elastic.inOut(1,0.6)"
      });
  }

  update() {
    this.particles.rotation.x += 0.00005;
    this.particles.rotation.y += 0.00005;
    this.particles.rotation.z += 0.00005;
  }
}

export default Particles;
