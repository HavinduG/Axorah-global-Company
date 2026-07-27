'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// @ts-ignore
import { gsap } from 'gsap';
import { AcfHeroSectionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface HeroProps {
    heroData: AcfHeroSectionItem;
}


function generateSphere(count: number, radius: number) {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = radius * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

function StarField(props: any) {
    const ref = useRef<any>(null);
    const [sphere] = useState(() => generateSphere(5000, 1.5));

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#463FA6"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

// Helper to make useState work inside component
// Removed duplicate import

export function Hero({ heroData }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from('.hero-text-element', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0 opacity-60">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <StarField />
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl pt-20">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight md:leading-tight lg:leading-tight text-balance mx-auto">
                    <span className="hero-text-element inline-block">{heroData.main_title || 'Design better Build faster'}</span>
                </h1>

                <p className="hero-text-element text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    {heroData.sub_hero_title}
                </p>

                <div className="hero-text-element flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base font-semibold min-w-[140px]">
                        {heroData['button_-start']}
                    </Button>
                    <Button
                        className="bg-white/10 text-white hover:bg-white/20 rounded-full px-8 py-6 text-base font-normal border border-white/20 backdrop-blur-sm min-w-[180px]"
                    >
                        {heroData.button_expert_}
                    </Button>
                </div>
            </div>

            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
        </section>
    );
}
