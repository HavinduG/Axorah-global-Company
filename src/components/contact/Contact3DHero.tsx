'use client';

import React, { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const GravityWell = () => {
    const pointsRef = useRef<THREE.Points>(null);

    const count = 1200;
    const radius = 22;

    const [positions, scales, colors, baseAngles, baseRadii] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        const baseAngles = new Float32Array(count);
        const baseRadii = new Float32Array(count);

        const colorWhite = new THREE.Color("#ffffff");
        const colorViolet = new THREE.Color("#8b5cf6");

        for (let i = 0; i < count; i++) {
            // Distribute stars in a spiral/vortex shape
            const angle = Math.random() * Math.PI * 2;
            const r = Math.pow(Math.random(), 1.5) * radius;
            const y = (Math.random() - 0.5) * 5;

            positions[i * 3] = Math.cos(angle) * r;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = Math.sin(angle) * r;

            baseAngles[i] = angle;
            baseRadii[i] = r;

            // Bokeh effect - scale based on distance and random
            scales[i] = Math.random() * 2 + 0.5;

            // Color: Center is more violet, edges are white
            const mixRatio = Math.max(0, 1 - (r / (radius * 0.4)));
            const finalColor = colorWhite.clone().lerp(colorViolet, mixRatio * 0.8);

            colors[i * 3] = finalColor.r;
            colors[i * 3 + 1] = finalColor.g;
            colors[i * 3 + 2] = finalColor.b;
        }

        return [positions, scales, colors, baseAngles, baseRadii];
    }, [count, radius]);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                
                attribute vec3 color;
                attribute float scale;
                attribute float baseAngle;
                attribute float baseRadius;
                
                varying vec3 vColor;
                varying float vDistance;
                
                void main() {
                    vColor = color;
                    
                    // Orbit calculation - vortex effect
                    float speed = 0.8 / (baseRadius + 2.0);
                    float currentAngle = baseAngle - uTime * speed;
                    
                    vec3 pos = position;
                    pos.x = cos(currentAngle) * baseRadius;
                    pos.z = sin(currentAngle) * baseRadius;
                    
                    // Magnetic pull towards mouse
                    vec3 mousePos = vec3(uMouse.x * 25.0, -uMouse.y * 25.0, 0.0);
                    float distToMouse = distance(pos, mousePos);
                    
                    if (distToMouse < 10.0) {
                        float pull = (10.0 - distToMouse) * 0.08;
                        pos = mix(pos, mousePos, pull);
                    }
                    
                    // Vertical wave mapping
                    pos.y += sin(uTime * 0.3 + baseRadius) * 0.8;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    
                    // Bokeh depth of field concept
                    vDistance = -mvPosition.z;
                    gl_PointSize = scale * (200.0 / vDistance);
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vDistance;
                
                void main() {
                    vec2 xy = gl_PointCoord.xy - vec2(0.5);
                    float ll = length(xy);
                    
                    if(ll > 0.5) discard;
                    
                    // Soft edges for bokeh blur effect
                    float blur = smoothstep(0.5, 0.1, ll);
                    
                    // Depth fade
                    float depthOpacity = smoothstep(35.0, 5.0, vDistance);
                    
                    gl_FragColor = vec4(vColor, blur * depthOpacity * 0.9);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
    }, []);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            const material = pointsRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value += delta;

            // Smooth mouse mapping
            material.uniforms.uMouse.value.lerp(
                new THREE.Vector2(state.pointer.x, state.pointer.y),
                0.1
            );

            // Ambient camera tilt
            state.camera.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 3 + 6;
            state.camera.position.x = Math.cos(state.clock.elapsedTime * 0.1) * 2;
            state.camera.lookAt(0, 0, 0);
        }
    });

    return (
        <points ref={pointsRef} material={shaderMaterial}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
                <bufferAttribute attach="attributes-baseAngle" args={[baseAngles, 1]} />
                <bufferAttribute attach="attributes-baseRadius" args={[baseRadii, 1]} />
            </bufferGeometry>
        </points>
    );
};

export const Contact3DHero = () => {
    return (
        <section className="relative w-full min-h-[100vh] bg-black overflow-hidden flex items-center justify-center pt-24 pb-12">
            {/* 3D Canvas Background (Gravity Well) */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 6, 22]} fov={50} />
                    <GravityWell />
                </Canvas>
            </div>

            {/* Subtle overlay gradients for contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)] z-10 pointer-events-none" />

            <div className="relative z-20 w-full max-w-lg mx-auto px-6 mt-16 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-10"
                >
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4">
                        Send a <span className="text-[#a78bfa]">Message</span>
                    </h1>
                    <p className="text-gray-400 font-light">
                        Step into our gravity well. We read every message and usually respond within 24 hours.
                    </p>
                </motion.div>

                {/* Contact Form Container (The 'Central Point') */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_50px_rgba(139,92,246,0.1)]"
                >
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />

                    <form className="relative z-10 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-xs uppercase tracking-widest text-gray-500 font-medium ml-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Your Name"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-500 font-medium ml-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="text-xs uppercase tracking-widest text-gray-500 font-medium ml-1">Message</label>
                            <textarea
                                id="message"
                                placeholder="How can we help?"
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            className="mt-2 w-full bg-white text-black font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-violet-100 transition-colors group/btn"
                        >
                            <span>Launch Message</span>
                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </button>
                    </form>
                </motion.div>

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
        </section>
    );
};
