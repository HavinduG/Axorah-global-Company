'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { CapabilitiesHero } from '@/components/capabilities/CapabilitiesHero';

// --- Data ---
const SERVICE_DATA = [
    {
        id: 'web-dev',
        title: "Web Development",
        short_description: "Our web development service focuses on creating powerful, scalable, and visually appealing websites that help businesses establish a strong online presence.",
        description_paragraphs: [
            "Our web development service focuses on creating powerful, scalable, and visually appealing websites that help businesses establish a strong online presence. We design and develop websites that are fully responsive, ensuring a seamless experience across desktops, tablets, and mobile devices. From simple corporate websites to advanced web applications and e-commerce platforms, we deliver solutions that are tailored to your business goals.",
            "We follow modern development standards and best practices to ensure fast loading times, strong security, and excellent performance. Our team works with the latest technologies and frameworks to build clean, maintainable, and future-ready code. Search engine optimization (SEO), accessibility, and usability are considered at every stage of development, helping your website rank better and reach a wider audience.",
            "We also provide ongoing maintenance and support to ensure your website remains updated, secure, and optimized as your business grows. Our goal is to create websites that not only look great but also deliver real results by converting visitors into customers and supporting long-term business success."
        ],
        color: "#3b82f6" // blue-500
    },
    {
        id: 'mobile-app',
        title: "Mobile App Development",
        short_description: "Our mobile app development service is designed to help businesses reach their customers through high-quality, feature-rich mobile applications.",
        description_paragraphs: [
            "Our mobile app development service is designed to help businesses reach their customers through high-quality, feature-rich mobile applications. We develop applications for both Android and iOS platforms, focusing on performance, usability, and scalability. Whether you need a business app, e-commerce app, or a custom solution, we build applications that align with your vision and business objectives.",
            "We follow a structured development process that includes planning, design, development, testing, and deployment. This ensures that every app we deliver is stable, secure, and user-friendly. Our developers use modern technologies and frameworks to create smooth, responsive, and visually appealing mobile experiences.",
            "Security and data protection are key priorities in our mobile app solutions. We also ensure easy integration with third-party services, APIs, and backend systems. After launch, we provide continuous support, updates, and performance optimization to keep your app running smoothly and meeting user expectations."
        ],
        color: "#a855f7" // purple-500
    },
    {
        id: 'ui-ux',
        title: "UI/UX Design",
        short_description: "Our UI/UX design service focuses on creating intuitive, engaging, and visually consistent digital experiences.",
        description_paragraphs: [
            "Our UI/UX design service focuses on creating intuitive, engaging, and visually consistent digital experiences. We believe that good design is not just about appearance, but also about how users interact with a product. Our design process starts with understanding your users, business goals, and market requirements to create designs that are both functional and attractive.",
            "We design user interfaces that are clean, modern, and easy to navigate, ensuring a smooth user journey across all devices. From wireframes and prototypes to final designs, we carefully plan every detail to enhance usability and user satisfaction. Our designs help reduce complexity, improve engagement, and increase conversion rates.",
            "Consistency, accessibility, and brand identity are core elements of our design approach. We ensure that every design aligns with your brand’s voice and values. By combining creativity with user-centered design principles, we deliver experiences that leave a lasting impression and build trust with your audience."
        ],
        color: "#ec4899" // pink-500
    },
    {
        id: 'software-dev',
        title: "Software Development",
        short_description: "Our software development service delivers custom-built solutions that help businesses streamline operations and improve productivity.",
        description_paragraphs: [
            "Our software development service delivers custom-built solutions that help businesses streamline operations and improve productivity. We develop software tailored to your specific requirements, whether it’s a desktop application, enterprise system, or cloud-based solution. Our goal is to create reliable and scalable software that grows with your business.",
            "We follow industry-standard development methodologies to ensure high-quality results, including thorough testing and quality assurance. Our solutions are designed with security, performance, and flexibility in mind. We work closely with clients throughout the development process to ensure transparency and alignment with business objectives.",
            "Integration with existing systems, automation of workflows, and data management are key strengths of our software solutions. We also provide post-deployment support, updates, and enhancements to ensure long-term reliability. Our custom software helps businesses reduce manual work, increase efficiency, and gain a competitive advantage."
        ],
        color: "#22c55e" // green-500
    }
];

// --- 3D Scene Component ---
const Scene = ({ activeIndex }: { activeIndex: number }) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.x += delta * 0.1;
        }
    });

    return (
        <group ref={meshRef}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {activeIndex === 0 && (
                    <mesh>
                        <icosahedronGeometry args={[1.5, 0]} />
                        <meshStandardMaterial color={SERVICE_DATA[0].color} roughness={0.2} metalness={0.8} wireframe />
                    </mesh>
                )}
                {activeIndex === 1 && (
                    <mesh>
                        <torusKnotGeometry args={[1, 0.35, 100, 32]} />
                        <meshStandardMaterial color={SERVICE_DATA[1].color} roughness={0.15} metalness={0.9} />
                    </mesh>
                )}
                {activeIndex === 2 && (
                    <mesh>
                        <sphereGeometry args={[1.5, 64, 64]} />
                        <meshStandardMaterial color={SERVICE_DATA[2].color} roughness={0.05} metalness={1} envMapIntensity={1.5} />
                    </mesh>
                )}
                {activeIndex === 3 && (
                    <mesh>
                        <boxGeometry args={[2, 2, 2]} />
                        <meshStandardMaterial color={SERVICE_DATA[3].color} roughness={0.2} metalness={0.8} wireframe />
                    </mesh>
                )}
            </Float>
            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </group>
    );
};

// --- Main Layout Component ---
export const CapabilitiesClient = () => {
    return (
        <div className="w-full bg-black text-white relative min-h-screen pb-24 overflow-hidden">
            {/* Page Header */}
            <CapabilitiesHero />

            {/* Services List - Standard Vertical Flow */}
            <div className="flex flex-col gap-16 lg:gap-20 pt-12 lg:pt-16">
                {SERVICE_DATA.map((service, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div key={service.id} className="w-full relative">
                            {/* Animated Divider inside each section */}
                            <div className="px-6 lg:px-20 mb-8 lg:mb-12">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
                                />
                            </div>

                            <div className={cn(
                                "flex flex-col-reverse gap-12 lg:gap-20 px-6 lg:px-20 items-center",
                                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                            )}>

                                {/* Left/Text Side */}
                                <div className="w-full lg:w-1/2 flex flex-col z-10 relative">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div
                                            className="h-[2px] w-12"
                                            style={{ backgroundColor: service.color }}
                                        />
                                        <span className="text-sm font-medium tracking-wider uppercase text-gray-400">
                                            0{index + 1} / 0{SERVICE_DATA.length}
                                        </span>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                                        {service.title}
                                    </h2>

                                    <p className="text-lg md:text-xl text-gray-300 font-light border-l-2 pl-6 border-white/10 mb-8 leading-relaxed">
                                        {service.short_description}
                                    </p>

                                    {/* Full details text */}
                                    <div className="prose prose-invert max-w-none text-gray-400 text-base leading-relaxed mb-0 lg:mb-10 flex flex-col gap-4">
                                        {service.description_paragraphs.map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Right/Visual Side - Dedicated Canvas per Section */}
                                <div className="w-full lg:w-1/2 flex items-center justify-center p-0 lg:p-0 z-0">
                                    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[650px] rounded-[2rem] overflow-hidden border border-white/5 bg-gradient-to-br from-zinc-900 to-black shadow-2xl transition-all duration-700 ease-in-out">
                                        {/* iOS-style header/notch simulation */}
                                        <div className="absolute top-0 left-0 w-full h-12 border-b border-white/5 flex items-center px-6 gap-2 z-20 bg-black/50 backdrop-blur-md">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        </div>

                                        {/* Next.js/Three.js Model */}
                                        <Canvas shadows className="w-full h-full pointer-events-none">
                                            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                                            <ambientLight intensity={0.5} />
                                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                                            <pointLight position={[-10, -10, -10]} intensity={0.5} />

                                            <Environment preset="city" />

                                            <Scene activeIndex={index} />
                                        </Canvas>

                                        {/* Visual Identifier Overlay */}
                                        <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 z-20">
                                            <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono text-gray-400 transition-all duration-300">
                                                REL: {service.id.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CapabilitiesClient;
