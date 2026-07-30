"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  PerspectiveCamera,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AcfServiceItem } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

// Fallback color palette per service index
const SERVICE_COLORS = ["#3b82f6", "#a855f7", "#ec4899", "#22c55e"];

// Fallback static services if no WordPress data provided
const FALLBACK_SERVICES: AcfServiceItem[] = [
  {
    acf_fc_layout: "service_compatibilities",
    service_title: "Web Development",
    service_short_description:
      "Our web development service focuses on creating powerful, scalable, and visually appealing websites that help businesses establish a strong online presence.",
    service_description:
      "<p>Our web development service focuses on creating powerful, scalable, and visually appealing websites. We design and develop websites that are fully responsive, ensuring a seamless experience across desktops, tablets, and mobile devices.</p><p>We follow modern development standards and best practices to ensure fast loading times, strong security, and excellent performance.</p><p>We also provide ongoing maintenance and support to ensure your website remains updated, secure, and optimized as your business grows.</p>",
  },
  {
    acf_fc_layout: "service_compatibilities",
    service_title: "Mobile App Development",
    service_short_description:
      "Our mobile app development service is designed to help businesses reach their customers through high-quality, feature-rich mobile applications.",
    service_description:
      "<p>We develop applications for both Android and iOS platforms, focusing on performance, usability, and scalability.</p><p>We follow a structured development process that includes planning, design, development, testing, and deployment.</p><p>After launch, we provide continuous support, updates, and performance optimization.</p>",
  },
  {
    acf_fc_layout: "service_compatibilities",
    service_title: "UI/UX Design",
    service_short_description:
      "Our UI/UX design service focuses on creating intuitive, engaging, and visually consistent digital experiences.",
    service_description:
      "<p>We believe that good design is not just about appearance, but also about how users interact with a product.</p><p>We design user interfaces that are clean, modern, and easy to navigate ensuring a smooth user journey across all devices.</p><p>Consistency, accessibility, and brand identity are core elements of our design approach.</p>",
  },
  {
    acf_fc_layout: "service_compatibilities",
    service_title: "Software Development",
    service_short_description:
      "Our software development service delivers custom-built solutions that help businesses streamline operations and improve productivity.",
    service_description:
      "<p>We develop software tailored to your specific requirements, whether it's a desktop application, enterprise system, or cloud-based solution.</p><p>We follow industry-standard development methodologies to ensure high-quality results.</p><p>Integration with existing systems, automation of workflows, and data management are key strengths of our solutions.</p>",
  },
];

// Strip HTML tags helper
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

// Extract paragraphs from HTML
function extractParagraphs(html: string): string[] {
  const paragraphs = html
    .split(/<\/p>/i)
    .map((p) => stripHtml(p))
    .filter((p) => p.length > 0);
  return paragraphs.length > 0 ? paragraphs : [stripHtml(html)];
}

// --- 3D Scene Component ---
const Scene = ({
  activeIndex,
  color,
}: {
  activeIndex: number;
  color: string;
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
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
            <meshStandardMaterial
              color={color}
              roughness={0.2}
              metalness={0.8}
              wireframe
            />
          </mesh>
        )}
        {activeIndex === 1 && (
          <mesh>
            <torusKnotGeometry args={[1, 0.35, 100, 32]} />
            <meshStandardMaterial
              color={color}
              roughness={0.15}
              metalness={0.9}
            />
          </mesh>
        )}
        {activeIndex === 2 && (
          <mesh>
            <sphereGeometry args={[1.5, 64, 64]} />
            <meshStandardMaterial
              color={color}
              roughness={0.05}
              metalness={1}
              envMapIntensity={1.5}
            />
          </mesh>
        )}
        {(activeIndex === 3 || activeIndex > 3) && (
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
              color={color}
              roughness={0.2}
              metalness={0.8}
              wireframe
            />
          </mesh>
        )}
      </Float>
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.5}
        scale={10}
        blur={2.5}
        far={4}
      />
    </group>
  );
};

// --- Props ---
interface InteractiveScrollLayoutProps {
  services?: AcfServiceItem[];
  sectionTitle?: string;
  sectionDescription?: string;
}

// --- Main Component ---
export const InteractiveScrollLayout = ({
  services,
  sectionTitle,
  sectionDescription,
}: InteractiveScrollLayoutProps) => {
  const serviceData =
    services && services.length > 0 ? services : FALLBACK_SERVICES;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleExpanded = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Initial Entry Animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" } as const,
    },
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Select all sections
      const sections = gsap.utils.toArray<HTMLElement>(".service-section");

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center", // Simplified trigger
          end: "bottom center",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });

      // Force refresh to ensure positions are calculated correctly after layout changes
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="w-full bg-black text-white relative"
    >
      {/* Animated Divider */}
      <div className="px-6 lg:px-20">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent origin-left"
        />
      </div>

      {/* Section Header */}
      <div className="px-6 lg:px-20 pt-12 pb-12 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
        <div className="max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6"
          >
            {sectionTitle ? (
              <>{sectionTitle}</>
            ) : (
              <>
                Build, <span className="text-gray-500">Integrate,</span> Scale
              </>
            )}
          </motion.h2>

          {sectionDescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-[#a1a1aa] font-light leading-relaxed prose prose-invert prose-p:my-2"
              dangerouslySetInnerHTML={{ __html: sectionDescription }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse">
        {/* Right Column: 3D Canvas (Sticky) - First in DOM for correct Mobile Stack */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen sticky top-0 lg:top-0 items-center justify-center p-4 lg:p-12 bg-zinc-950 border-l border-white/5 z-0 lg:flex">
          <div className="relative w-full h-full max-h-200 rounded-[2rem] overflow-hidden border border-white/5 bg-linear-to-br from-zinc-900 to-black shadow-2xl transition-all duration-700 ease-in-out">
            {/* iOS-style header/notch simulation */}
            <div className="absolute top-0 left-0 w-full h-12 border-b border-white/5 flex items-center px-6 gap-2 z-20 bg-black/50 backdrop-blur-md">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            <Canvas shadows className="w-full h-full">
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
                castShadow
              />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />

              <Environment preset="city" />

              <Scene
                activeIndex={activeIndex}
                color={SERVICE_COLORS[activeIndex] ?? SERVICE_COLORS[0]}
              />
            </Canvas>

            {/* Visual Identifier Overlay */}
            <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 z-20">
              <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono text-gray-400 transition-all duration-300">
                REL:{" "}
                {serviceData[activeIndex]?.service_title
                  ?.toUpperCase()
                  .replace(/\s+/g, "-") ?? `SERVICE-${activeIndex + 1}`}
              </div>
            </div>
          </div>
        </div>

        {/* Left Column: Content (Scrolling) - Second in DOM */}
        <div className="w-full lg:w-1/2 flex flex-col z-10 relative bg-transparent lg:bg-black pointer-events-none lg:pointer-events-auto">
          {serviceData.map((service, index) => {
            const serviceId = service.service_title
              .toLowerCase()
              .replace(/\s+/g, "-");
            const color =
              SERVICE_COLORS[index] ??
              SERVICE_COLORS[SERVICE_COLORS.length - 1];
            const paragraphs = extractParagraphs(service.service_description);

            return (
              <div
                key={serviceId}
                className="service-section min-h-[80vh] lg:min-h-screen flex flex-col justify-center px-6 lg:px-20 py-24 border-l-0 lg:border-l border-white/5"
                data-index={index}
              >
                {/* Text Card */}
                <div
                  className={cn(
                    "transition-opacity duration-500 ease-in-out pointer-events-auto",
                    "bg-black/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none rounded-2xl p-6 lg:p-0 border border-white/10 lg:border-none",
                    index === activeIndex
                      ? "opacity-100 blur-0"
                      : "opacity-30 blur-sm",
                  )}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="h-0.5 w-12"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium tracking-wider uppercase text-gray-400">
                      0{index + 1} / 0{serviceData.length}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
                    {service.service_title}
                  </h2>

                  <p className="text-lg md:text-xl text-gray-300 font-light lg:border-l-2 lg:pl-6 border-white/10 mb-8">
                    {service.service_short_description}
                  </p>

                  {/* Full content */}
                  <div className="prose prose-invert max-w-none text-gray-400 text-sm leading-relaxed">
                    <p className="mb-4">{paragraphs[0]}</p>

                    {expandedSections[serviceId] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {paragraphs.slice(1).map((para, i) => (
                          <p key={i} className="mb-4">
                            {para}
                          </p>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpanded(serviceId)}
                    className="text-gray-400 hover:text-white text-sm font-medium underline underline-offset-4 mb-8 transition-colors"
                  >
                    {expandedSections[serviceId] ? "See less" : "See more"}
                  </button>

                  <Link href="/capabilities">
                    <button className="group w-fit flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300">
                      <span>Explore Service</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
