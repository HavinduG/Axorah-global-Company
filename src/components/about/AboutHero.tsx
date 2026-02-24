'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useSpring } from 'framer-motion';

const HyperSpeedStars = () => {
    const linesRef = useRef<THREE.LineSegments>(null);

    // Tap into framer-motion's scroll to drive the speed multiplier
    const { scrollY } = useScroll();
    const scrollVelocity = useSpring(scrollY, { damping: 50, stiffness: 400 });
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    useEffect(() => {
        return scrollVelocity.onChange((latest) => {
            // Calculate a speed multiplier based on scroll velocity
            // Base speed is 1. Scrolling increases it.
            const velocity = scrollVelocity.getVelocity();
            const additionalSpeed = Math.abs(velocity) * 0.005;
            setSpeedMultiplier(1 + additionalSpeed);
        });
    }, [scrollVelocity]);

    const count = 2000;
    const depth = 200;

    const [positions, colors, scales] = useMemo(() => {
        const positions = new Float32Array(count * 6); // 2 vertices per line (start and end)
        const colors = new Float32Array(count * 6);
        const scales = new Float32Array(count); // Individual star speed/length scales

        const colorWhite = new THREE.Color("#ffffff");
        const colorDim = new THREE.Color("#222222");

        for (let i = 0; i < count; i++) {
            // Random position in a cylinder around the Z axis
            const radius = 2 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;

            const x = Math.cos(theta) * radius;
            const y = Math.sin(theta) * radius;
            // Distribute along Z axis
            const z = (Math.random() - 0.5) * depth;

            // Line length/speed modifier
            const scale = 0.5 + Math.random() * 2.5;
            const length = 2.0 * scale;

            // Start vertex (further back, dimmer)
            positions[i * 6] = x;
            positions[i * 6 + 1] = y;
            positions[i * 6 + 2] = z - length;

            // End vertex (closer to viewer, brighter)
            positions[i * 6 + 3] = x;
            positions[i * 6 + 4] = y;
            positions[i * 6 + 5] = z;

            // Start color
            colors[i * 6] = colorDim.r;
            colors[i * 6 + 1] = colorDim.g;
            colors[i * 6 + 2] = colorDim.b;

            // End color
            colors[i * 6 + 3] = colorWhite.r;
            colors[i * 6 + 4] = colorWhite.g;
            colors[i * 6 + 5] = colorWhite.b;

            scales[i] = scale;
        }

        return [positions, colors, scales];
    }, [count, depth]);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 1.0 },
                uDepth: { value: depth }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uSpeed;
                uniform float uDepth;
                
                attribute vec3 color;
                attribute float scale;
                
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Move the star towards the viewer along the Z axis
                    // Modulo ensures they loop back around when passing the camera
                    float movement = uTime * 20.0 * scale * uSpeed;
                    pos.z = mod(pos.z + movement + uDepth / 2.0, uDepth) - uDepth / 2.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Slight opacity gradient based on color brightness
                    float alpha = max(vColor.r, max(vColor.g, vColor.b));
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
    }, [depth]);

    useFrame((state, delta) => {
        if (linesRef.current) {
            const material = linesRef.current.material as THREE.ShaderMaterial;
            // Instead of just adding time, we add delta * speedMultiplier so the 
            // acceleration is frame-independent and instantly responsive
            material.uniforms.uTime.value += delta * speedMultiplier;
            material.uniforms.uSpeed.value = THREE.MathUtils.lerp(
                material.uniforms.uSpeed.value,
                speedMultiplier,
                0.1
            );

            // Very slow ambient camera roll for a drifting in space feel
            state.camera.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        }
    });

    return (
        <lineSegments ref={linesRef} material={shaderMaterial}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-scale"
                    // We need to map the 1D scale array to both vertices of each line
                    args={[new Float32Array(Array.from(scales).flatMap(s => [s, s])), 1]}
                />
            </bufferGeometry>
        </lineSegments>
    );
};

interface AboutHeroProps {
    mainTitle: string;
    sectionTitle: string;
    smallDescription: string;
}

export const AboutHero = ({ mainTitle, sectionTitle, smallDescription }: AboutHeroProps) => {
    return (
        <div className="relative w-full h-[60vh] min-h-[500px] max-h-[800px] bg-black overflow-hidden flex items-center justify-center border-b border-white/5">
            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
                    <HyperSpeedStars />
                </Canvas>
            </div>

            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-10 pointer-events-none" />

            {/* Content Overlay */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-sm md:text-base font-medium tracking-widest text-gray-300 uppercase mb-6"
                >
                    {mainTitle}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.1]"
                >
                    {sectionTitle}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl leading-relaxed"
                >
                    {smallDescription}
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 hidden md:flex"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent relative overflow-hidden">
                    <motion.div
                        className="w-full h-1/2 bg-white"
                        animate={{ y: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                </div>
            </motion.div>
        </div>
    );
};
