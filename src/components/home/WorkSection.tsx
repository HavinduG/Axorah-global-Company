"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AcfWorkTab } from "@/lib/types";

const AUTO_SLIDE_INTERVAL = 6000; // 6 seconds

interface WorkSectionProps {
    workMainTitle: string;
    worksTabs: AcfWorkTab[];
}

export const WorkSection = ({ workMainTitle, worksTabs }: WorkSectionProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide functionality
    useEffect(() => {
        if (!worksTabs || worksTabs.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % worksTabs.length);
        }, AUTO_SLIDE_INTERVAL);

        return () => clearInterval(timer);
    }, [worksTabs]);

    if (!worksTabs || worksTabs.length === 0) return null;

    const currentWork = worksTabs[currentIndex];

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
                            {workMainTitle}
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
                        {worksTabs.map((_, idx) => (
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


                {/* Right Content: Video Only */}
                <div className="relative h-[500px] lg:h-[600px] w-full flex items-center justify-center">
                    {worksTabs.map((work, idx) => {
                        const isActive = currentIndex === idx;
                        return (
                            <motion.div
                                key={`video-container-${idx}`}
                                initial={false}
                                animate={{
                                    opacity: isActive ? 1 : 0,
                                    scale: isActive ? 1 : 0.95,
                                    zIndex: isActive ? 10 : 0
                                }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="absolute inset-0 w-full h-full"
                                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                            >
                                {/* Main Card */}
                                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                                    {/* Video */}
                                    <video
                                        className="w-full h-full object-cover"
                                        src={work.project_short_video.url}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};
