"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Data provided in the prompt
const WORK_DATA = {
    work_main_title: "What We’ve Built",
    works_tabs: [
        {
            acf_fc_layout: "work_tab",
            icon_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/target.svg",
                alt: "target",
            },
            work_description:
                "<p><strong>PulseShop UI/UX Design</strong><br />\nA high-converting e-commerce interface designed for a modern retail experience. This project focuses on a &#8220;mobile-first&#8221; approach, featuring a clean product grid, intuitive filtering systems, and a seamless one-page checkout process. The design uses vibrant accents to draw attention to call-to-action buttons, ensuring a fluid user journey from discovery to purchase.</p>",
            background_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/309753.jpg",
            },
            project_short_video: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/Video_Preview_Link_Provided.mp4",
            },
        },
        {
            acf_fc_layout: "work_tab",
            icon_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/wifi.svg",
                alt: "wifi",
            },
            work_description:
                "<p><strong>Nexus Corp Digital Presence</strong><br />\nA professional and authoritative corporate website layout tailored for B2B services. The design emphasizes trust and clarity, utilizing a structured layout to showcase company values, service offerings, and data-driven insights. It features a sophisticated color palette, bold typography, and professional imagery to establish a strong brand identity in a competitive market.</p>",
            background_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/dark-theme-flex-background-in-ultra-hd-4k_EP7V.webp",
            },
            project_short_video: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/E_commerce_Website_Preview_Video.mp4",
            },
        },
        {
            acf_fc_layout: "work_tab",
            icon_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/landmark.svg",
                alt: "landmark",
            },
            work_description:
                "<p><strong>Zenith Portfolio Concept</strong><br />\nA minimalist, content-focused portfolio designed for creative professionals. By removing human stock photography, the project highlights pure UI/UX craftsmanship through sophisticated typography, ample white space, and smooth micro-interactions. The layout features an interactive project gallery and a sleek dark-mode aesthetic, making the work the centerpiece of the user experience.</p>",
            background_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/images.jpg",
            },
            project_short_video: {
                url: "http://axorah-global.local/wp-content/uploads/2026/02/Video_Preview_Link_Provided.mp4",
            },
        },
    ],
};

const AUTO_SLIDE_INTERVAL = 6000; // 6 seconds

export const WorkSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % WORK_DATA.works_tabs.length);
        }, AUTO_SLIDE_INTERVAL);

        return () => clearInterval(timer);
    }, []);

    const currentWork = WORK_DATA.works_tabs[currentIndex];

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="bg-black text-white py-24 px-6 lg:px-20 overflow-hidden relative min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* Left Content: Description & Icon */}
                <div className="flex flex-col justify-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                            {WORK_DATA.work_main_title}
                        </h2>
                    </motion.div>

                    {/* Animate text content content change */}
                    <div className="relative h-[400px]"> {/* Fixed height container to prevent layout jump */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                                    <div className="w-12 h-12 mb-6 bg-white/10 rounded-full flex items-center justify-center p-2.5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={currentWork.icon_image.url}
                                            alt={currentWork.icon_image.alt}
                                            className="w-full h-full object-contain filter invert"
                                        />
                                    </div>

                                    <div
                                        className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: currentWork.work_description }}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex gap-3 mt-8">
                        {WORK_DATA.works_tabs.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleDotClick(idx)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    currentIndex === idx
                                        ? "bg-white w-8"
                                        : "bg-white/20 hover:bg-white/40"
                                )}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                </div>


                {/* Right Content: Video & Background */}
                <div className="relative h-[500px] lg:h-[600px] w-full flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Dynamic Background matching video/image */}
                            <div
                                className="absolute inset-0 rounded-3xl overflow-hidden opacity-50 blur-3xl transform scale-110"
                                style={{
                                    backgroundImage: `url(${currentWork.background_image.url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/20 z-0" />

                            {/* Main Card */}
                            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                                {/* Video */}
                                <video
                                    key={`video-${currentIndex}`} // Force re-render/play on change
                                    className="w-full h-full object-cover"
                                    src={currentWork.project_short_video.url}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
};
