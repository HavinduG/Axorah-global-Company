'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const Constellation = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);

    const count = 350; // number of stars
    const distance = 30; // spread distance
    const connectionDistance = 4; // distance to connect lines
    const mouseConnectionRadius = 10; // distance around mouse to connect more

    // particles and initial positions
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * distance;
            const y = (Math.random() - 0.5) * distance;
            const z = (Math.random() - 0.5) * distance * 0.5; // less depth
            temp.push({ x, y, z });
        }
        return temp;
    }, []);

    const positions = useMemo(() => new Float32Array(count * 3), [count]);

    // line material
    const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.7
    }), []);

    useFrame((state) => {
        if (!pointsRef.current || !linesRef.current) return;

        const time = state.clock.elapsedTime;

        // 1. Update particle positions with sine noise for organic movement
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const p = particles[i];

            // tiny organic drift
            positions[i3] = p.x + Math.sin(time * 0.3 + p.y) * 0.4;
            positions[i3 + 1] = p.y + Math.cos(time * 0.2 + p.x) * 0.4;
            positions[i3 + 2] = p.z + Math.sin(time * 0.4 + p.z) * 0.4;
        }

        pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // 2. Draw lines based on proximity
        const linePositions = [];
        const lineColors = [];

        // Map pointer to 3D roughly
        const mx = (state.pointer.x * distance) / 2;
        const my = (state.pointer.y * distance) / 2;
        const mouseVec = new THREE.Vector3(mx, my, 0);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const p1 = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            const distToMouse = p1.distanceTo(mouseVec);

            for (let j = i + 1; j < count; j++) {
                const j3 = j * 3;
                const p2 = new THREE.Vector3(positions[j3], positions[j3 + 1], positions[j3 + 2]);
                const dist = p1.distanceTo(p2);

                let alpha = 0;

                // Connection logically
                if (distToMouse < mouseConnectionRadius && dist < connectionDistance * 1.5) {
                    alpha = 1.0 - (dist / (connectionDistance * 1.5));
                } else if (dist < connectionDistance) {
                    alpha = 0.25 * (1.0 - (dist / connectionDistance));
                }

                if (alpha > 0) {
                    linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                    // Additive blending uses RGB as alpha
                    lineColors.push(alpha, alpha, alpha, alpha, alpha, alpha);
                }
            }
        }

        linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

        // slight ambient camera pan
        state.camera.position.x = Math.sin(time * 0.05) * 1.0;
        state.camera.position.y = Math.cos(time * 0.05) * 1.0;
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry />
                <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
            </points>
            <lineSegments ref={linesRef} material={lineMaterial}>
                <bufferGeometry />
            </lineSegments>
        </group>
    );
};

interface WorkHeroProps {
    title: string;
    description: string;
}

export const WorkHero = ({ title, description }: WorkHeroProps) => {
    return (
        <div className="relative w-full min-h-[90vh] bg-black overflow-hidden flex items-center justify-center pt-24 pb-12">
            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
                    <Constellation />
                </Canvas>
            </div>

            {/* Gradient Overlay for better contrast on cards */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black z-10 pointer-events-none" />

            {/* Content Overlay - Bento Box Layout */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 mb-12">

                {/* Main Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="md:col-span-8 p-10 md:p-14 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden group flex flex-col justify-end min-h-[400px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <span className="text-sm md:text-base font-medium tracking-widest text-gray-300 uppercase mb-4 block">
                        Our Portfolio
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl leading-relaxed">
                        {description}
                    </p>
                </motion.div>

                {/* Right Side Stats / Small Cards */}
                <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col justify-center items-start relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <span className="text-5xl font-bold text-white mb-2">500+</span>
                        <span className="text-gray-400 font-medium tracking-wide">Projects Delivered</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col justify-center items-start relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <span className="text-5xl font-bold text-white mb-2">12</span>
                        <span className="text-gray-400 font-medium tracking-wide">Industry Awards</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col justify-center items-start sm:col-span-2 md:col-span-1 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <h3 className="text-xl font-bold text-white mb-2">Innovation First</h3>
                        <p className="text-gray-400 text-sm">We push the boundaries of what's possible on the web, blending high end design with robust engineering.</p>
                    </motion.div>
                </div>
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
