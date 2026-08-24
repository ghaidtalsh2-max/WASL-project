'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobeCanvasProps {
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
  showArc?: boolean;
  animated?: boolean;
  interactive?: boolean;
  themePrimary?: string;
  themeSecondary?: string;
  className?: string;
  onTransitionComplete?: () => void;
}

export default function GlobeCanvas({
  originLat = 24.7136, // Riyadh
  originLng = 46.6753,
  destLat = 35.6762,  // Tokyo
  destLng = 139.6503,
  showArc = true,
  animated = true,
  interactive = true,
  themePrimary = '#EC4899',
  themeSecondary = '#8B5CF6',
  className = 'w-full h-full',
  onTransitionComplete,
}: GlobeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.9;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Globe Sphere Mesh
    const globeRadius = 1.0;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);

    // Procedural Earth shader texture / Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Deep space ocean background
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Continent landmass shapes with cyber luminescence
      ctx.fillStyle = '#101B35';
      
      // Rough world landmass approximation on equirectangular map
      // Eurasia & Africa
      ctx.beginPath();
      ctx.ellipse(550, 200, 190, 110, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(520, 310, 90, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      // Americas
      ctx.beginPath();
      ctx.ellipse(260, 180, 120, 90, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(320, 340, 75, 110, 0, 0, Math.PI * 2);
      ctx.fill();
      // East Asia / Japan
      ctx.beginPath();
      ctx.ellipse(820, 180, 45, 55, 0.4, 0, Math.PI * 2);
      ctx.fill();
      // Australia
      ctx.beginPath();
      ctx.ellipse(840, 360, 65, 50, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden city lights network
      ctx.fillStyle = '#FDE047';
      for (let i = 0; i < 350; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connecting neural arcs on texture
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 25; i++) {
        ctx.beginPath();
        const startX = 400 + Math.random() * 450;
        const startY = 120 + Math.random() * 200;
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(
          startX + (Math.random() - 0.5) * 80,
          startY - 30,
          startX + (Math.random() - 0.5) * 120,
          startY + (Math.random() - 0.5) * 80
        );
        ctx.stroke();
      }
    }

    const globeTexture = new THREE.CanvasTexture(canvas);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: globeTexture,
      bumpScale: 0.05,
      specular: new THREE.Color(0x334466),
      shininess: 15,
      transparent: true,
      opacity: 0.95,
    });

    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);

    // 4. Glowing Atmosphere Rim Mesh
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.05, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.92, 0.28, 0.6, 1.0) * intensity * 1.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 5. Starfield Particles in background
    const starsCount = 450;
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 18;
      starsPos[i + 1] = (Math.random() - 0.5) * 18;
      starsPos[i + 2] = -2 - Math.random() * 8;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.7,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 6. Coordinates Helper
    function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    // 7. Global Transit Network Hubs & Secondary Arcs
    const globalHubs = [
      { name: 'Riyadh', lat: 24.7136, lng: 46.6753 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
      { name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
      { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
      { name: 'London', lat: 51.5074, lng: -0.1278 },
      { name: 'Paris', lat: 48.8566, lng: 2.3522 },
      { name: 'Prague', lat: 50.0755, lng: 14.4378 },
      { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
      { name: 'New York', lat: 40.7128, lng: -74.0060 },
    ];

    const hubPositions = globalHubs.map((h) =>
      latLngToVector3(h.lat, h.lng, globeRadius * 1.01)
    );

    // Add visual beacons for all global network hubs
    const hubMarkerGeo = new THREE.SphereGeometry(0.014, 12, 12);
    const hubMarkerMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.85 });

    hubPositions.forEach((pos) => {
      const hubMesh = new THREE.Mesh(hubMarkerGeo, hubMarkerMat);
      hubMesh.position.copy(pos);
      globeMesh.add(hubMesh);
    });

    // Secondary Global Transit Arcs & Moving Photons
    interface NetworkArc {
      curve: THREE.QuadraticBezierCurve3;
      photon: THREE.Mesh;
      progress: number;
      speed: number;
    }

    const networkArcs: NetworkArc[] = [];
    const hubConnections: Array<[number, number]> = [
      [0, 2], // Riyadh - Dubai
      [2, 3], // Dubai - Istanbul
      [0, 4], // Riyadh - Cairo
      [3, 7], // Istanbul - Prague
      [7, 6], // Prague - Paris
      [6, 5], // Paris - London
      [5, 9], // London - New York
      [2, 8], // Dubai - Singapore
      [8, 1], // Singapore - Tokyo
      [3, 1], // Istanbul - Tokyo
      [4, 6], // Cairo - Paris
    ];

    const secondaryArcMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      linewidth: 1,
      transparent: true,
      opacity: 0.35,
    });

    const photonGeoSecondary = new THREE.SphereGeometry(0.012, 8, 8);
    const photonMatSecondary = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    hubConnections.forEach(([i1, i2]) => {
      const p1 = hubPositions[i1];
      const p2 = hubPositions[i2];
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(globeRadius + dist * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(25);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geom, secondaryArcMat);
      globeMesh.add(line);

      const photon = new THREE.Mesh(photonGeoSecondary, photonMatSecondary);
      globeMesh.add(photon);

      networkArcs.push({
        curve,
        photon,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.007,
      });
    });

    // 8. Markers (Origin & Destination)
    const originPos = latLngToVector3(originLat, originLng, globeRadius * 1.01);
    const destPos = latLngToVector3(destLat, destLng, globeRadius * 1.01);

    // Origin Marker (Gold / Sand)
    const originMarkerGeo = new THREE.SphereGeometry(0.026, 16, 16);
    const originMarkerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const originMarker = new THREE.Mesh(originMarkerGeo, originMarkerMat);
    originMarker.position.copy(originPos);
    globeMesh.add(originMarker);

    // Destination Marker (Pink / Magenta)
    const destMarkerGeo = new THREE.SphereGeometry(0.03, 16, 16);
    const destMarkerMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const destMarker = new THREE.Mesh(destMarkerGeo, destMarkerMat);
    destMarker.position.copy(destPos);
    globeMesh.add(destMarker);

    // 9. Primary Flight Trajectory Arc
    let curveMesh: THREE.Line | null = null;
    let photonMesh: THREE.Mesh | null = null;
    let curvePath: THREE.QuadraticBezierCurve3 | null = null;

    if (showArc) {
      // Calculate arc apex point above sphere
      const midPoint = new THREE.Vector3().addVectors(originPos, destPos).multiplyScalar(0.5);
      const distance = originPos.distanceTo(destPos);
      midPoint.normalize().multiplyScalar(globeRadius + distance * 0.42);

      curvePath = new THREE.QuadraticBezierCurve3(originPos, midPoint, destPos);
      const points = curvePath.getPoints(50);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({
        color: 0xec4899,
        linewidth: 3,
        transparent: true,
        opacity: 0.95,
      });
      curveMesh = new THREE.Line(arcGeometry, arcMaterial);
      globeMesh.add(curveMesh);

      // Flying primary photon / plane light with glow
      const photonGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const photonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      photonMesh = new THREE.Mesh(photonGeo, photonMat);
      globeMesh.add(photonMesh);
    }

    // 9. Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xec4899, 1.5);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    // 10. Interactive Drag & Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeMesh.rotation.y += deltaX * 0.005;
      globeMesh.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !interactive || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      globeMesh.rotation.y += deltaX * 0.006;
      globeMesh.rotation.x += deltaY * 0.006;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 11. Animation Loop
    let animationFrameId: number;
    let progress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (animated && !isDragging) {
        globeMesh.rotation.y += 0.002;
        starField.rotation.y += 0.0003;
      }

      // Animate secondary network photons across the 3D globe
      networkArcs.forEach((na) => {
        na.progress += na.speed;
        if (na.progress > 1) na.progress = 0;
        const pt = na.curve.getPoint(na.progress);
        na.photon.position.copy(pt);
      });

      // Animate primary flight photon along main arc
      if (photonMesh && curvePath) {
        progress += 0.008;
        if (progress > 1) progress = 0;
        const currentPos = curvePath.getPoint(progress);
        photonMesh.position.copy(currentPos);
      }

      // Marker pulse animation for origin & destination
      const scale = 1 + Math.sin(Date.now() * 0.006) * 0.25;
      destMarker.scale.set(scale, scale, scale);
      originMarker.scale.set(1 + Math.cos(Date.now() * 0.006) * 0.2, 1 + Math.cos(Date.now() * 0.006) * 0.2, 1 + Math.cos(Date.now() * 0.006) * 0.2);

      renderer.render(scene, camera);
    };

    animate();

    // 12. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [originLat, originLng, destLat, destLng, showArc, animated, interactive, themePrimary, themeSecondary]);

  return <div ref={containerRef} className={`relative overflow-hidden ${className}`} />;
}
