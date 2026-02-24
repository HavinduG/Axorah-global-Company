"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WordPressProject } from "@/lib/types";

interface WorkGridProps {
    projects: WordPressProject[];
}

export const WorkGrid = ({ projects }: WorkGridProps) => {
    // If no projects, render nothing
    if (!projects || projects.length === 0) return null;

    // Animation variants for stagger children
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 70,
                damping: 15,
            },
        },
    };

    return (
        <section className="bg-black py-24 px-6 lg:px-20 min-h-screen">
            <div className="max-w-7xl mx-auto w-full">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 md:mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">
                        All Projects
                    </h2>
                    <p className="text-gray-400 max-w-2xl text-lg lg:text-xl">
                        A definitive collection of our digital experiences, brand identities, and enterprise solutions.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
                >
                    {projects.map((project) => {
                        const title = project.title?.rendered || project.acf?.project_name;
                        // Prioritize ACF project image, fallback to gallery, fallback to nothing
                        const imageUrl = project.acf?.project_image?.url || project.acf?.project_gallery?.[0]?.url;

                        return (
                            <motion.div key={project.id} variants={itemVariants}>
                                <Link href={`/project/${project.slug}`} className="block group">
                                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 mb-6 border border-white/10">
                                        {/* Image wrapper for scaling effect */}
                                        <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover"
                                                    priority={false}
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex flex-col justify-end p-8">
                                            <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                                <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-2xl font-semibold text-white tracking-wide">
                                                    {title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text below the card (visible without hover) */}
                                    <h3 className="text-xl font-medium text-white group-hover:text-gray-300 transition-colors">
                                        {title}
                                    </h3>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};
