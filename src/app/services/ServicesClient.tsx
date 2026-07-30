"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  PerspectiveCamera,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CapabilitiesHero } from "@/components/capabilities/CapabilitiesHero";
import { AcfServiceItem, AcfServiceSection } from "@/lib/types";

// --- Fallback colors for each service index (used when no color is provided by WP) ---
const SERVICE_COLORS = [
  "#3b82f6", // blue-500  – index 0
  "#a855f7", // purple-500 – index 1
  "#ec4899", // pink-500   – index 2
  "#22c55e", // green-500  – index 3
];

// --- Fallback static services shown when WordPress data is unavailable ---
const FALLBACK_SERVICES: AcfServiceItem[] = [
  {
    acf_fc_layout: "service_compatibilities",
    service_title: "Web Development",
    service_short_description:
      "Our web development service focuses on creating powerful, scalable, and visually appealing websites that help businesses establish a strong online presence.",
    service_description:
      "<p>Our web development service focuses on creating powerful, scalable, and visually appealing websites. We design and develop websites that are fully responsive, ensuring a seamless experience across desktops, tablets, and mobile devices.</p><p>We follow modern development standards and best practices to ensure fast loading times, strong security, and excellent performance. Search engine optimization (SEO), accessibility, and usability are considered at every stage of development.</p><p>We also provide ongoing maintenance and support to ensure your website remains updated, secure, and optimized as your business grows.</p>",
  },
  {
    acf_fc_layout: "service_compatibilities",
    service_title: "Mobile App Development",
    service_short_description:
      "Our mobile app development service is designed to help businesses reach their customers through high-quality, feature-rich mobile applications.",
    service_description:
      "<p>We develop applications for both Android and iOS platforms, focusing on performance, usability, and scalability. Whether you need a business app, e-commerce app, or a custom solution, we build applications that align with your vision.</p><p>We follow a structured development process that includes planning, design, development, testing, and deployment. Our developers use modern technologies to create smooth, responsive, and visually appealing mobile experiences.</p><p>After launch, we provide continuous support, updates, and performance optimization to keep your app running smoothly.</p>",
  },
  {
    acf_fc_layout: "service_compatibilities",
    service_title: "UI/UX Design",
    service_short_description:
      "Our UI/UX design service focuses on creating intuitive, engaging, and visually consistent digital experiences.",
    service_description:
      "<p>We believe that good design is not just about appearance, but also about how users interact with a product. Our design process starts with understanding your users, business goals, and market requirements.</p><p>We design user interfaces that are clean, modern, and easy to navigate. From wireframes and prototypes to final designs, we carefully plan every detail to enhance usability and user satisfaction.</p><p>Consistency, accessibility, and brand identity are core elements of our design approach. By combining creativity with user-centered design principles, we deliver experiences that leave a lasting impression.</p>",
  },
  {
    acf_fc_layout: "service_compatibilities",
    service_title: "Software Development",
    service_short_description:
      "Our software development service delivers custom-built solutions that help businesses streamline operations and improve productivity.",
    service_description:
      "<p>We develop software tailored to your specific requirements, whether it's a desktop application, enterprise system, or cloud-based solution. Our goal is to create reliable and scalable software that grows with your business.</p><p>We follow industry-standard development methodologies to ensure high-quality results, including thorough testing and quality assurance. We work closely with clients throughout the development process.</p><p>Integration with existing systems, automation of workflows, and data management are key strengths of our software solutions. We also provide post-deployment support and enhancements.</p>",
  },
];

const FALLBACK_APPROACH: AcfServiceSection = {
  acf_fc_layout: "service_sections",
  main_title: "Our Service Approach",
  service_description:
    "<h3><strong>01. Understand</strong></h3><p>We first understand your business, goals, target audience, current challenges, and expected outcome.</p><h3><strong>02. Plan</strong></h3><p>We prepare a clear strategy, service scope, content direction, project timeline, and digital growth plan.</p><h3><strong>03. Build</strong></h3><p>We design, develop, create, or set up the required solution.</p><h3><strong>04. Launch</strong></h3><p>We test, optimize, and launch the project.</p><h3><strong>05. Grow</strong></h3><p>After launch, we support ongoing improvements.</p>",
};

// --- Strip HTML helper ---
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

// --- Split HTML paragraphs into plain text array ---
function extractParagraphs(html: string): string[] {
  const paragraphs = html
    .split(/<\/p>/i)
    .map((p) => stripHtml(p))
    .filter((p) => p.length > 0);
  return paragraphs.length > 0 ? paragraphs : [stripHtml(html)];
}

// --- Parse Approach Steps from HTML ---
function parseSteps(html: string) {
  const steps = [];
  const regex = /<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const title = stripHtml(match[1]);
    const description = stripHtml(match[2]);
    if (title && description) {
      steps.push({ title, description });
    }
  }
  return steps;
}

// --- Parse Industries from HTML ---
function parseIndustries(html: string) {
  const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (!paragraphs || paragraphs.length < 2) {
    return { intro: stripHtml(html), industries: [] };
  }
  const intro = stripHtml(paragraphs[0]);
  const listHtml = paragraphs[1];
  const industries = listHtml
    .split(/<br\s*\/?>/i)
    .map(stripHtml)
    .filter(Boolean);
  return { intro, industries };
}

// --- 3D Scene Component ---
const Scene = ({ activeIndex }: { activeIndex: number }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  const color = SERVICE_COLORS[activeIndex] ?? SERVICE_COLORS[0];

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

// --- Props interface ---
interface ServicesClientProps {
  services?: AcfServiceItem[];
  sectionTitle?: string;
  sectionDescription?: string;
  serviceSections?: AcfServiceSection[];
  ctaSectionTitle?: string;
  ctaDescription?: string;
  btn1Text?: string;
  btn1Url?: string;
  btn2Text?: string;
  btn2Url?: string;
}

// --- Main Layout Component ---
export const ServicesClient = ({
  services,
  sectionTitle,
  sectionDescription,
  serviceSections,
  ctaSectionTitle,
  ctaDescription,
  btn1Text,
  btn1Url,
  btn2Text,
  btn2Url,
}: ServicesClientProps) => {
  // Use dynamic data if available, otherwise fall back to static data
  const serviceData =
    services && services.length > 0 ? services : FALLBACK_SERVICES;

  const approachSection = serviceSections?.[0] || FALLBACK_APPROACH;
  const approachSteps = parseSteps(approachSection?.service_description || "");

  const industriesSection = serviceSections?.find((s) =>
    s.main_title.toLowerCase().includes("industries"),
  );
  const industriesData = industriesSection
    ? parseIndustries(industriesSection.service_description)
    : null;

  const whyChooseSection = serviceSections?.find((s) =>
    s.main_title.toLowerCase().includes("why choose"),
  ) || {
    acf_fc_layout: "service_sections",
    main_title: "Why Choose ZenonTec?",
    service_description: "<h3>Sri Lanka-based, serving worldwide</h3>\n<p>ZenonTec is based in Sri Lanka and supports clients across Sri Lanka, UAE, and international markets.</p>\n<h3>One team for technology and growth</h3>\n<p>We combine website development, app development, software systems, SEO, digital marketing, paid<br />\ncampaigns, creative design, and lead generation under one digital growth approach.</p>\n<h3>Built for real business results</h3>\n<p>Our focus is not only to design beautiful websites or create posts. We build digital solutions that help<br />\nbusinesses increase visibility, generate inquiries, improve sales, and manage operations better.</p>\n<h3>Practical and clear communication</h3>\n<p>We explain the process clearly and help clients understand what needs to be done, why it matters, and how<br />\nit supports business growth.</p>\n<h3>Experience across multiple industries</h3>\n<p>ZenonTec has handled projects across healthcare, beauty, wedding, cargo, restaurant, clothing, IT, business<br />\nsetup, e-commerce, and service-based industries.</p>\n<h3>Growth-focused delivery</h3>\n<p>Every project is planned around clear goals such as website traffic, brand awareness, customer inquiries,<br />\nonline sales, lead conversion, or operational efficiency.</p>\n<p>&nbsp;</p>\n"
  };

  const whyChooseSteps = parseSteps(
    whyChooseSection?.service_description || "",
  );

  const faqSection = serviceSections?.find((s) =>
    s.main_title.toLowerCase().includes("frequently asked") || s.main_title.toLowerCase().includes("faq"),
  );

  const faqSteps = parseSteps(
    faqSection?.service_description || "",
  );

  const [activeWhyChoose, setActiveWhyChoose] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Fallbacks for the final CTA
  const finalCtaTitle = ctaSectionTitle || "Ready to Build Your Digital Growth System?";
  const finalCtaDesc = ctaDescription || "Whether you need a website, mobile app, custom software, SEO, social media marketing, paid advertising, creative design, or lead generation support, ZenonTec can help you build, launch, and grow with confidence.";
  const finalBtn1Text = btn1Text || "Start Your Project";
  const finalBtn1Url = btn1Url || "/#contact";
  const finalBtn2Text = btn2Text || "View Our Work";
  const finalBtn2Url = btn2Url || "/#work";

  return (
    <div className="w-full bg-black text-white relative min-h-screen pb-24 overflow-hidden">
      {/* Page Header */}
      <CapabilitiesHero
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
      />

      {/* Services List - Standard Vertical Flow */}
      <div className="flex flex-col gap-16 lg:gap-20 pt-12 lg:pt-16">
        {serviceData.map((service, index) => {
          const isEven = index % 2 === 0;
          const color =
            SERVICE_COLORS[index] ?? SERVICE_COLORS[SERVICE_COLORS.length - 1];
          const paragraphs = extractParagraphs(service.service_description);
          // Generate a stable ID from title
          const serviceId = service.service_title
            .toLowerCase()
            .replace(/\s+/g, "-");

          return (
            <div key={serviceId} className="w-full relative">
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

              <div
                className={cn(
                  "flex flex-col-reverse gap-12 lg:gap-20 px-6 lg:px-20 items-center",
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse",
                )}
              >
                {/* Left/Text Side */}
                <div className="w-full lg:w-1/2 flex flex-col z-10 relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="h-[2px] w-12"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium tracking-wider uppercase text-gray-400">
                      0{index + 1} / 0{serviceData.length}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                    {service.service_title}
                  </h2>

                  <p className="text-lg md:text-xl text-gray-300 font-light border-l-2 pl-6 border-white/10 mb-8 leading-relaxed">
                    {service.service_short_description}
                  </p>

                  {/* Full details text */}
                  <div className="prose prose-invert max-w-none text-gray-400 text-base leading-relaxed mb-0 lg:mb-10 flex flex-col gap-4">
                    {paragraphs.map((para, i) => (
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

                    {/* Three.js 3D Model */}
                    <Canvas
                      shadows
                      className="w-full h-full pointer-events-none"
                    >
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
                      <Scene activeIndex={index} />
                    </Canvas>

                    {/* Visual Identifier Overlay */}
                    <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 z-20">
                      <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono text-gray-400 transition-all duration-300">
                        REL: {serviceId.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Approach Section */}
      {approachSection && approachSteps.length > 0 && (
        <div className="w-full px-6 lg:px-20 py-24 bg-black relative mt-16 border-t border-white/5">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 lg:mb-24"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {approachSection.main_title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approachSteps.map((step, index) => {
                // Extract the number (e.g. "01") and the rest of the title
                const titleMatch = step.title.match(/^(\d+)\.\s*(.*)$/);
                const number = titleMatch ? titleMatch[1] : `0${index + 1}`;
                const titleText = titleMatch ? titleMatch[2] : step.title;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 hover:bg-zinc-900 transition-all duration-300 group overflow-hidden"
                  >
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="text-5xl font-bold text-white/10 mb-6 group-hover:text-white/20 transition-colors duration-300">
                        {number}
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                        {titleText}
                      </h3>
                      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Industries We Serve Section */}
      {industriesSection &&
        industriesData &&
        industriesData.industries.length > 0 && (
          <div className="w-full px-6 lg:px-20 py-24 bg-[#030303] relative border-t border-white/5 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  {industriesSection.main_title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-8" />
                <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                  {industriesData.intro}
                </p>
              </motion.div>

              {/* Glowing Interactive Tags Grid */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {industriesData.industries.map((industry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 cursor-default shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm"
                  >
                    {industry}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* Why Choose ZenonTec Section - Horizontal Hover Accordion */}
      {whyChooseSection && whyChooseSteps.length > 0 && (
        <div className="w-full px-6 lg:px-12 py-16 lg:py-24 bg-black relative border-t border-white/5 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-[1400px] mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                {whyChooseSection.main_title}
              </h2>
              <div className="w-16 h-1 bg-linear-to-r from-blue-500 to-green-500 mx-auto rounded-full" />
            </motion.div>

            {/* Horizontal Accordion */}
            <div className="flex flex-col lg:flex-row w-full h-auto lg:h-[450px] gap-3 lg:gap-4 mt-12">
              {whyChooseSteps.map((step, index) => {
                const isActive = activeWhyChoose === index;
                return (
                  <motion.div
                    key={index}
                    onClick={() => setActiveWhyChoose(index)}
                    onHoverStart={() => setActiveWhyChoose(index)}
                    animate={{
                      flex: isActive ? 6 : 1,
                    }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    className={cn(
                      "relative rounded-3xl overflow-hidden cursor-pointer border transition-colors duration-500 flex flex-col lg:flex-row",
                      isActive
                        ? "bg-zinc-900/80 border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                        : "bg-zinc-900/30 border-white/5 hover:bg-zinc-900/50"
                    )}
                    style={{ minHeight: "80px" }}
                  >
                    {/* Collapsed/Header State */}
                    <div
                      className={cn(
                        "flex lg:flex-col items-center justify-between lg:justify-start gap-4 p-5 lg:p-6 shrink-0 h-full w-full lg:w-24 transition-opacity duration-300",
                        isActive ? "opacity-100 lg:w-20" : "opacity-70 hover:opacity-100"
                      )}
                    >
                      <div className="text-2xl lg:text-3xl font-bold text-white/40 font-mono">
                        0{index + 1}
                      </div>
                      
                      {/* On desktop, show rotated title when collapsed. On mobile, always show horizontal title in header */}
                      <div className="block lg:hidden text-lg font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis w-full text-left">
                        {step.title}
                      </div>
                      
                      <div className="hidden lg:flex items-center justify-center flex-1 w-full">
                        {!isActive && (
                          <span className="whitespace-nowrap -rotate-90 text-lg font-medium text-gray-300 tracking-wider">
                            {step.title}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded Content State */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        x: isActive ? 0 : 20,
                        height: isActive ? "auto" : 0,
                      }}
                      transition={{ duration: 0.4, delay: isActive ? 0.1 : 0 }}
                      className={cn(
                        "flex-1 px-6 lg:px-10 lg:pl-0 flex flex-col justify-center overflow-hidden",
                        isActive ? "pb-6 lg:pb-0" : ""
                      )}
                    >
                      <h3 className="hidden lg:block text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                        {step.title}
                      </h3>
                      <div className="w-12 h-1 bg-blue-500 rounded-full mb-6 hidden lg:block" />
                      <p className="text-sm lg:text-base text-gray-300 leading-relaxed font-light max-w-2xl">
                        {step.description}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions Section */}
      {faqSection && faqSteps.length > 0 && (
        <div className="w-full px-6 lg:px-12 py-16 lg:py-24 bg-[#050505] relative border-t border-white/5 overflow-hidden">
          {/* Subtle glowing orbs */}
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 lg:mb-16"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                {faqSection.main_title}
              </h2>
              <div className="w-16 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
            </motion.div>

            <div className="flex flex-col gap-4">
              {faqSteps.map((step, index) => {
                const isActive = activeFaq === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onClick={() => setActiveFaq(isActive ? null : index)}
                    className={cn(
                      "group cursor-pointer rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden",
                      isActive
                        ? "bg-zinc-900/60 border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                        : "bg-zinc-900/30 border-white/5 hover:bg-zinc-900/50 hover:border-white/10"
                    )}
                  >
                    <div className="p-6 flex items-center justify-between gap-4">
                      <h3
                        className={cn(
                          "text-lg lg:text-xl font-medium transition-colors duration-300",
                          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                        )}
                      >
                        {step.title}
                      </h3>
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white"
                        )}
                      >
                        <motion.div
                          animate={{ rotate: isActive ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isActive ? <Minus size={20} /> : <Plus size={20} />}
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 text-gray-400 leading-relaxed font-light">
                            {step.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Final Call to Action Section */}
      <div className="w-full px-6 lg:px-12 py-24 lg:py-32 relative bg-black border-t border-white/5 overflow-hidden flex items-center justify-center">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] opacity-40 pointer-events-none">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-blue-600/30 blur-[100px] rounded-full"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-purple-600/30 blur-[120px] rounded-full"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 md:p-16 rounded-[2.5rem] bg-zinc-900/30 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              {finalCtaTitle}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              {stripHtml(finalCtaDesc)}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href={finalBtn1Url}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {finalBtn1Text}
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              
              <Link href={finalBtn2Url}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-transparent text-white rounded-full font-semibold text-lg border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all"
                >
                  {finalBtn2Text}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServicesClient;
