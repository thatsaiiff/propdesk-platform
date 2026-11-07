"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 3. Renderer with transparent background
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // WebGL not supported, graceful fallback
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Lighting - Royal Blue & Gold tones
    const ambientLight = new THREE.AmbientLight(0x1d4ed8, 1.2); // Royal blue ambient
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xd4af37, 3, 20); // Warm gold specular
    goldPointLight.position.set(4, 3, 4);
    scene.add(goldPointLight);

    const bluePointLight = new THREE.PointLight(0x3b82f6, 2.5, 20); // Electric royal blue rim
    bluePointLight.position.set(-4, -2, 3);
    scene.add(bluePointLight);

    // 5. Central 3D Architectural / Crystalline Geometry
    // Outer wireframe geometric structure
    const outerGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Gold
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      metalness: 0.85,
      roughness: 0.2,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Inner floating core (represents asset vault / financial core)
    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Royal Blue core
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.45,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Edge highlight for inner mesh
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerLineMat = new THREE.LineBasicMaterial({
      color: 0xffd700, // Bright gold edge
      transparent: true,
      opacity: 0.7,
      linewidth: 2,
    });
    const innerLines = new THREE.LineSegments(innerEdges, innerLineMat);
    innerMesh.add(innerLines);

    // 6. Floating Asset Nodes / Gold Particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random() * 0.5 + 0.5;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle material
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37, // Champagne gold
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Mouse Interactivity / Parallax with Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      // Rotate geometric meshes smoothly
      outerMesh.rotation.x = elapsedTime * 0.12 + mouseY * 0.4;
      outerMesh.rotation.y = elapsedTime * 0.18 + mouseX * 0.4;

      innerMesh.rotation.x = -elapsedTime * 0.18 + mouseY * 0.6;
      innerMesh.rotation.y = -elapsedTime * 0.25 + mouseX * 0.6;

      // Pulse floating particles
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = -elapsedTime * 0.03;

      // Slight camera parallax
      camera.position.x = mouseX * 0.8;
      camera.position.y = -mouseY * 0.8;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // 10. Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      innerEdges.dispose();
      innerLineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
