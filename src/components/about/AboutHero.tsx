'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const FloatingSynapse = () => {
    const groupRef = useRef<THREE.Group>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);

    const count = 250;
    const radius = 4.5;
    const maxDistance = 1.8;

    const { originalPositions, connections } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const pointsArr: THREE.Vector3[] = [];

        for (let i = 0; i < count; i++) {
            // Distribute points in a spherical shell
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            // Push points slightly towards the outer edge
            const r = radius * (0.6 + 0.4 * Math.cbrt(Math.random()));

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            pointsArr.push(new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
        }

        const conns: { a: number, b: number }[] = [];
        // Connect nodes that are close enough
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                if (pointsArr[i].distanceTo(pointsArr[j]) < maxDistance) {
                    conns.push({ a: i, b: j });
                }
            }
        }
        return { originalPositions: pos, connections: conns };
    }, [count, radius, maxDistance]);

    // Mutable arrays to avoid allocations in useFrame
    const currentPositions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);
    const velocities = useMemo(() => new Float32Array(count * 3), [count]);
    const linePositions = useMemo(() => new Float32Array(connections.length * 6), [connections.length]);

    const mouse3D = useRef(new THREE.Vector3(999, 999, 999));

    useEffect(() => {
        if (!groupRef.current) return;

        const grp = groupRef.current;

        // GSAP: Slow rotation
        gsap.to(grp.rotation, {
            y: Math.PI * 2,
            duration: 40,
            repeat: -1,
            ease: "none"
        });

        gsap.to(grp.rotation, {
            x: Math.PI * 0.15,
            duration: 25,
            repeat: -1,
            ease: "sine.inOut",
            yoyo: true
        });

        // GSAP: "Breathe" (pulsate slightly in scale)
        gsap.to(grp.scale, {
            x: 1.05,
            y: 1.05,
            z: 1.05,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        return () => {
            gsap.killTweensOf(grp.rotation);
            gsap.killTweensOf(grp.scale);
        };
    }, []);

    useFrame(() => {
        // Convert mouse 3D position to local space
        const localMouse = mouse3D.current.clone();
        if (groupRef.current) {
            groupRef.current.worldToLocal(localMouse);
        }

        const spring = 0.05;
        const friction = 0.85;
        const repulsionRadius = 3.5;
        const repulsionStrength = 0.08;

        // Apply physics to nodes
        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            const tx = originalPositions[ix];
            const ty = originalPositions[iy];
            const tz = originalPositions[iz];

            let cx = currentPositions[ix];
            let cy = currentPositions[iy];
            let cz = currentPositions[iz];

            // Spring force towards original position
            velocities[ix] += (tx - cx) * spring;
            velocities[iy] += (ty - cy) * spring;
            velocities[iz] += (tz - cz) * spring;

            // Repulsion force from mouse
            const dx = cx - localMouse.x;
            const dy = cy - localMouse.y;
            const dz = cz - localMouse.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < repulsionRadius * repulsionRadius && distSq > 0.001) {
                const dist = Math.sqrt(distSq);
                const force = (repulsionRadius - dist) * repulsionStrength;
                velocities[ix] += (dx / dist) * force;
                velocities[iy] += (dy / dist) * force;
                velocities[iz] += (dz / dist) * force;
            }

            // Apply friction
            velocities[ix] *= friction;
            velocities[iy] *= friction;
            velocities[iz] *= friction;

            // Update positions
            currentPositions[ix] += velocities[ix];
            currentPositions[iy] += velocities[iy];
            currentPositions[iz] += velocities[iz];
        }

        if (pointsRef.current) {
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Update lines based on new node positions
        for (let i = 0; i < connections.length; i++) {
            const { a, b } = connections[i];

            linePositions[i * 6] = currentPositions[a * 3];
            linePositions[i * 6 + 1] = currentPositions[a * 3 + 1];
            linePositions[i * 6 + 2] = currentPositions[a * 3 + 2];

            linePositions[i * 6 + 3] = currentPositions[b * 3];
            linePositions[i * 6 + 4] = currentPositions[b * 3 + 1];
            linePositions[i * 6 + 5] = currentPositions[b * 3 + 2];
        }

        if (linesRef.current) {
            linesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <>
            {/* Invisible plane to catch mouse pointer events for exact 3D positioning */}
            <mesh
                visible={false}
                onPointerMove={(e) => mouse3D.current.copy(e.point)}
                onPointerOut={() => mouse3D.current.set(999, 999, 999)}
            >
                <planeGeometry args={[100, 100]} />
            </mesh>

            <group ref={groupRef}>
                <points ref={pointsRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={count}
                            args={[currentPositions, 3]}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        color="#ffffff"
                        size={0.05}
                        sizeAttenuation={true}
                        transparent
                        opacity={0.9}
                    />
                </points>

                <lineSegments ref={linesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={connections.length * 2}
                            args={[linePositions, 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial
                        color="#8a2be2" // Faint indigo / blue-violet
                        transparent
                        opacity={0.15}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </lineSegments>
            </group>
        </>
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
            {/* 3D Canvas Background STRICTLY PURE BLACK */}
            <div className="absolute inset-0 z-0 bg-black">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
                    <FloatingSynapse />
                </Canvas>
            </div>

            {/* Content Overlay */}
            {/* pointer-events-none ensures we don't block mouse movements intended for the 3D synapse layer */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto pointer-events-none">
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
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 hidden md:flex pointer-events-none"
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
