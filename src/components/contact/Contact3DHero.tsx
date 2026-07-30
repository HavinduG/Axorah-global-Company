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
                        Ready to build, launch, or grow your digital presence? Send us your project details and our team will get
back to you as soon as possible.

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
                            <label htmlFor="service" className="text-xs uppercase tracking-widest text-gray-500 font-medium ml-1">Service Required</label>
                            <div className="relative">
                                <select
                                    id="service"
                                    defaultValue=""
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled className="text-gray-500 bg-zinc-900">Select a service...</option>
                                    <option value="Web & App Development" className="text-white bg-zinc-900">Web & App Development</option>
                                    <option value="Digital Marketing & SEO" className="text-white bg-zinc-900">Digital Marketing & SEO</option>
                                    <option value="Software & Business Systems" className="text-white bg-zinc-900">Software & Business Systems</option>
                                    <option value="UI/UX Design & Creative Solutions" className="text-white bg-zinc-900">UI/UX Design & Creative Solutions</option>
                                    <option value="Not sure yet" className="text-white bg-zinc-900">Not sure yet</option>
                                </select>
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="text-xs uppercase tracking-widest text-gray-500 font-medium ml-1">Message</label>
                            <textarea
                                id="message"
                                placeholder="Tell us about your business, goals, timeline, and budget."
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

                        <a
                            href="https://wa.me/94775053300"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-colors group/wa"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover/wa:scale-110 transition-transform">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.45 3.42 1.25 4.88L2 22l5.31-1.18c1.42.74 3.03 1.18 4.68 1.18 5.52 0 10-4.48 10-10S17.51 2 11.99 2zm0 18.06c-1.46 0-2.88-.38-4.14-1.09l-.3-.17-3.08.68.69-3.03-.2-.31A8.044 8.044 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8.06-8.01 8.06zm4.39-5.96c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.04-.7-.52-1.17-1.16-1.31-1.4-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.34.98 2.5c.12.16 1.7 2.6 4.12 3.6.58.24 1.03.38 1.38.49.58.18 1.11.16 1.53.1.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
                            </svg>
                            <span>Chat on WhatsApp</span>
                        </a>
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
