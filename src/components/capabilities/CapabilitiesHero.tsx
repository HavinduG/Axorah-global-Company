"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const DataStreamNebula = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Grid resolution
  const countX = 120;
  const countZ = 60;
  const count = countX * countZ;

  const [positions, colors, sizes, phases] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    const colorBase = new THREE.Color("#4f46e5"); // Muted Indigo
    const colorAccent = new THREE.Color("#ffffff"); // High-contrast White

    let i = 0;
    for (let x = 0; x < countX; x++) {
      for (let z = 0; z < countZ; z++) {
        // Horizontal flowing grid distribution
        // We space them out to fill the viewport
        const posX = (x - countX / 2) * 0.4 + (Math.random() - 0.5) * 0.15;
        const posY = (Math.random() - 0.5) * 0.2;
        const posZ = (z - countZ / 2) * 0.4 + (Math.random() - 0.5) * 0.15;

        positions[i * 3] = posX;
        positions[i * 3 + 1] = posY;
        positions[i * 3 + 2] = posZ;

        // 8% chance to be a bright white accent star
        const isAccent = Math.random() > 0.92;
        const mixColor = isAccent ? colorAccent : colorBase;

        // Add some slight color variation to the indigo
        colors[i * 3] =
          mixColor.r + (isAccent ? 0 : (Math.random() - 0.5) * 0.1);
        colors[i * 3 + 1] =
          mixColor.g + (isAccent ? 0 : (Math.random() - 0.5) * 0.1);
        colors[i * 3 + 2] =
          mixColor.b + (isAccent ? 0 : (Math.random() - 0.5) * 0.1);

        // Accent stars are larger
        sizes[i] = isAccent
          ? Math.random() * 3.0 + 2.0
          : Math.random() * 1.5 + 0.5;

        phases[i] = Math.random() * Math.PI * 2;
        i++;
      }
    }

    return [positions, colors, sizes, phases];
  }, [count]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
                uniform float uTime;
                uniform vec2 uPointer;
                
                attribute float size;
                attribute vec3 color;
                attribute float phase;
                
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Subtle horizontal flowing wave motion
                    float wave1 = sin(pos.x * 0.3 + uTime * 0.6 + phase) * 0.4;
                    float wave2 = cos(pos.z * 0.4 + uTime * 0.4) * 0.3;
                    pos.y += wave1 + wave2;
    
                    // Mouse interaction - warp the grid to symbolize interaction with tech
                    // uPointer is normalized cursor position. Scale it to match grid coordinates roughly.
                    vec2 pointerWorld = uPointer * vec2(30.0, 15.0); 
                    
                    // We compare grid X/Z to Pointer X/Y since camera looks down somewhat from Z
                    float dist = distance(vec2(pos.x, -pos.z), pointerWorld);
                    
                    // Smoothstep the influence radius
                    float influence = smoothstep(12.0, 0.0, dist);
                    
                    // Pull particles upward (y) and slightly towards mouse (x,z)
                    pos.y += influence * 4.0;
                    pos.x += normalize(pos.x - pointerWorld.x) * influence * 1.5;
                    pos.z += normalize(pos.z + pointerWorld.y) * influence * 1.5;
                    
                    // Adjust opacity based on height to make peaks glow more
                    vAlpha = 0.4 + (pos.y * 0.15) + (influence * 0.5);
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    // Size attenuation
                    gl_PointSize = size * (40.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
      fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    // Create a soft glowing circle (pseudo-bloom)
                    float dist = distance(gl_PointCoord, vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    // Soft edges
                    float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;

      // Lagging mouse follow
      material.uniforms.uPointer.value.x = THREE.MathUtils.lerp(
        material.uniforms.uPointer.value.x,
        state.pointer.x,
        0.05,
      );
      material.uniforms.uPointer.value.y = THREE.MathUtils.lerp(
        material.uniforms.uPointer.value.y,
        state.pointer.y,
        0.05,
      );

      // Very slow ambient rotation of the entire grid
      pointsRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
      // Tilt the grid down slightly so we look across it
      pointsRef.current.rotation.x =
        Math.cos(state.clock.elapsedTime * 0.05) * 0.05 + 0.3;
    }
  });

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
      </bufferGeometry>
    </points>
  );
};

export const CapabilitiesHero = ({
  sectionTitle,
  sectionDescription,
}: {
  sectionTitle?: string;
  sectionDescription?: string;
}) => {
  return (
    <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden flex items-center justify-center border-b border-white/5 bg-black">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 4, 15]} fov={50} />
          <DataStreamNebula />
        </Canvas>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
          <span className="text-xs font-medium tracking-widest text-[#a1a1aa] uppercase">
            Discover
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6"
        >
          {sectionTitle || "Our Capabilities"}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-[#a1a1aa] max-w-2xl font-light leading-relaxed prose prose-invert prose-p:my-2"
          dangerouslySetInnerHTML={{
            __html:
              sectionDescription ||
              "<p>We deliver comprehensive digital solutions to help your business grow, innovate, and succeed in the modern landscape.</p>",
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 hidden md:flex"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-white/60"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
};
