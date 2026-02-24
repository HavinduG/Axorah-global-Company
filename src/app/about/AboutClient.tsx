"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AcfAboutImageItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AboutHero } from "@/components/about/AboutHero";

interface AboutClientProps {
    mainTitle: string;
    sectionTitle: string;
    smallDescription: string;
    images: AcfAboutImageItem[];
}

export default function AboutClient({
    mainTitle,
    sectionTitle,
    smallDescription,
    images
}: AboutClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div className="bg-black text-white min-h-screen pb-32" ref={containerRef}>
            {/* 3D Hero Section */}
            <AboutHero
                mainTitle={mainTitle}
                sectionTitle={sectionTitle}
                smallDescription={smallDescription}
            />

            {/* Detailed Content Sections */}
            <div className="max-w-7xl mx-auto flex flex-col gap-32 pt-20">
                {images && images.map((item, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={cn(
                                "flex flex-col gap-12 lg:gap-20 px-6 lg:px-20 items-center",
                                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                            )}
                        >
                            {/* Visual/Video Side */}
                            <div className="w-full lg:w-1/2 flex items-center justify-center relative">
                                <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                                    <video
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        src={item.about_image.url}
                                        muted
                                        loop
                                        playsInline
                                        autoPlay
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                                </div>
                                {/* Decorative elements */}
                                <div className={cn(
                                    "absolute -bottom-6 -z-10 w-2/3 h-2/3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full",
                                    isEven ? "-right-6" : "-left-6"
                                )} />
                            </div>

                            {/* Text Description Side */}
                            <div className="w-full lg:w-1/2 flex flex-col z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-[2px] w-12 bg-blue-500" />
                                    <span className="text-sm font-medium tracking-wider uppercase text-gray-400">
                                        0{index + 1}
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                                    {item.image_title}
                                </h2>

                                <div
                                    className="prose prose-invert prose-lg max-w-none text-gray-400 leading-relaxed font-light [&>p]:mb-6"
                                    dangerouslySetInnerHTML={{ __html: item.image_descripation }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
