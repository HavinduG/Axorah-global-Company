"use client";

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import { motion as framerMotion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import * as THREE from 'three';

// Interface for individual particles tracking their coordinates and speed.
interface ParticleData {
    x: number;
    y: number;
    z: number;
    speed: number;
}

const RisingParticles = () => {
    const count = 300;
    const meshRef = useRef<THREE.InstancedMesh>(null);

    // Create random particles spanning the scene
    const particles = useMemo<ParticleData[]>(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20; // Spread horizontally
            const y = (Math.random() - 0.5) * 15 - 5; // Spread vertically and lower
            const z = (Math.random() - 0.5) * 10 - 5; // Spread on Z
            const speed = Math.random() * 0.02 + 0.01; // Vary rising speed
            temp.push({ x, y, z, speed });
        }
        return temp;
    }, [count]);

    // Use a single dummy object to construct transformation matrices
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            // Update vertical position
            particle.y += particle.speed;

            // Loop back to bottom once it exceeds top threshold
            if (particle.y > 6) {
                particle.y = -8;
            }

            // Apply coordinates to dummy and set Matrix on instance
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        // Notify Three.js to re-render the matrix array
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {/* Small Glowing Orbs */}
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#3b82f6" />
        </instancedMesh>
    );
};

const AbstractHand = () => {
    // A stylized, pulsating abstract shape representing continuous upward growth/energy
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
            {/* Elongated along Y to simulate a vertical reach or aura */}
            <Sphere args={[1, 64, 64]} scale={[1.2, 2.2, 1.2]}>
                <MeshDistortMaterial
                    color="#000000"
                    emissive="#1e3a8a" // Deep blue glow
                    emissiveIntensity={1.5} // High intensity for digital feel
                    attach="material"
                    distort={0.4}       // Creates the organic liquid-slash-energy movement
                    speed={2}          // Speed of distortion wave
                    roughness={0.1}
                    metalness={0.9}
                    wireframe={true}    // Highly technical wireframe aesthetic
                />
            </Sphere>
        </Float>
    );
};

interface ShortSectionProps {
    title?: string;       // from acf.short_section_title
    ctaButtonText?: string; // from acf.button_sub
}

export const ShortSection = ({ title, ctaButtonText }: ShortSectionProps) => {
    // WordPress stores the title with a line-separator character (\u2028) between the two lines
    // Split on that or on a literal newline so we can render them on separate lines
    const titleLines = title
        ? title.split(/[\u2028\n]/).map((l) => l.trim()).filter(Boolean)
        : ['Design smart', 'Deliver fast'];
    return (
        <section className="relative bg-black text-white py-32 md:py-48 overflow-hidden min-h-[70vh] flex flex-col items-center justify-center">

            {/* 3D Generative Background Scene */}
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1.5} />
                    <AbstractHand />
                    <RisingParticles />
                    <Environment preset="city" />
                </Canvas>
            </div>

            {/* Text and CTAs Overlay */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 pointer-events-auto">
                <framerMotion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 md:mb-12 leading-[1.1]"
                    style={{ textShadow: "0px 4px 20px rgba(0, 0, 0, 0.9)" }}
                >
                    {titleLines[0]}{titleLines.length > 1 && <><br />{titleLines[1]}</>}
                </framerMotion.h2>

                <framerMotion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link
                        href="/#start"
                        className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors text-sm border border-transparent"
                    >
                        Start for work
                    </Link>
                    <Link
                        href="/#contact"
                        className="px-8 py-3 rounded-full bg-zinc-900/50 text-white font-medium hover:bg-zinc-800 transition-colors text-sm backdrop-blur-md border border-white/10"
                    >
                        {ctaButtonText || 'Contact'}
                    </Link>
                </framerMotion.div>
            </div>

            {/* Bottom Gradient Fade explicitly meant for bridging seamlessly into whatever footer component comes next */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
        </section>
    );
};
