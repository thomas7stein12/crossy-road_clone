import * as THREE from "three";

const activeBursts = [];
const particleClock = new THREE.Clock();

export function createParticleBurst(scene, position, color = 0xd62828) {
  const group = new THREE.Group();
  group.position.copy(position);

  const geometry = new THREE.BoxGeometry(5.5, 5.5, 5.5);

  const material = new THREE.MeshLambertMaterial({
    color,
    flatShading: true,
  });

  const particles = [];

  for (let i = 0; i < 8; i++) {
    const particle = new THREE.Mesh(geometry, material);

    const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;

    const speed = 50 + Math.random() * 45;

    particle.userData.velocity = new THREE.Vector3(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      45 + Math.random() * 45,
    );

    particle.userData.rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
    );

    particle.userData.age = 0;
    particle.userData.lifetime = 0.7 + Math.random() * 0.45;

    group.add(particle);
    particles.push(particle);
  }

  scene.add(group);

  activeBursts.push({
    group,
    geometry,
    material,
    particles,
  });
}

export function animateParticleBursts() {
  const delta = Math.min(particleClock.getDelta(), 0.05);

  for (let i = activeBursts.length - 1; i >= 0; i--) {
    const burst = activeBursts[i];

    let remaining = 0;

    for (const particle of burst.particles) {
      if (!particle.visible) continue;

      const data = particle.userData;

      data.age += delta;

      const progress = data.age / data.lifetime;

      if (progress >= 1) {
        particle.visible = false;
        continue;
      }

      remaining++;

      data.velocity.z -= 140 * delta;

      particle.position.addScaledVector(data.velocity, delta);

      particle.rotation.x += data.rotationSpeed.x * delta;
      particle.rotation.y += data.rotationSpeed.y * delta;
      particle.rotation.z += data.rotationSpeed.z * delta;

      particle.scale.setScalar(1 - progress);
    }

    if (remaining === 0) {
      burst.group.parent?.remove(burst.group);

      burst.geometry.dispose();
      burst.material.dispose();

      activeBursts.splice(i, 1);
    }
  }
}
