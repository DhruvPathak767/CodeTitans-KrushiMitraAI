import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CropGlobe3D({ className = 'w-full h-80' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe Particle Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Core Sphere Geometry Particles
    const radius = 1.3;
    const count = 750;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorGreen = new THREE.Color('#22c55e');
    const colorBlue = new THREE.Color('#3b82f6');
    const colorAmber = new THREE.Color('#f59e0b');

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color distribution (agricultural green + water blue + sunrise gold)
      const r = Math.random();
      const c = r < 0.6 ? colorGreen : r < 0.85 ? colorBlue : colorAmber;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const points = new THREE.Points(geometry, material);
    globeGroup.add(points);

    // Satellite Orbit Ring
    const ringGeo = new THREE.RingGeometry(1.65, 1.67, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    globeGroup.add(ring);

    // Satellite Beacon
    const satGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const satellite = new THREE.Mesh(satGeo, satMat);
    globeGroup.add(satellite);

    let angle = 0;
    let reqId: number;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      angle += 0.015;
      globeGroup.rotation.y += 0.003;
      globeGroup.rotation.x += (mouseY - globeGroup.rotation.x) * 0.05;
      globeGroup.rotation.y += (mouseX - globeGroup.rotation.y) * 0.05;

      // Move satellite along orbit
      satellite.position.x = 1.66 * Math.cos(angle);
      satellite.position.z = 1.66 * Math.sin(angle);
      satellite.position.y = 0.5 * Math.sin(angle);

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
