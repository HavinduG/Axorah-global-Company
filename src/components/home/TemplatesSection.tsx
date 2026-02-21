'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { AcfProjectTemplateItem, AcfCustomerItem } from '@/lib/types';

interface TemplatesSectionProps {
    templates: AcfProjectTemplateItem[];
    customers: AcfCustomerItem[];
}

const TemplateCard = ({ item, index }: { item: AcfProjectTemplateItem; index: number }) => {
    const isVideo = item.project_view.mime_type === 'video/mp4';

    // Randomize height slightly for the look if needed, but we rely on natural aspect ratios
    // We can add a parallax effect to the image inside the container

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
                duration: 0.8,
                delay: (index % 3) * 0.1, // Stagger based on column position roughly
                ease: [0.21, 0.47, 0.32, 0.98] // Smooth custom easing
            }}
            className="relative mb-4 break-inside-avoid rounded-lg overflow-hidden group cursor-pointer"
        >
            <div className="relative w-full bg-gray-900/20 overflow-hidden">
                {isVideo ? (
                    <video
                        src={item.project_view.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                ) : (
                    <img
                        src={item.project_view.url}
                        alt={item.project_view.alt || item.project_view.title}
                        width={item.project_view.width}
                        height={item.project_view.height}
                        className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        loading="lazy"
                    />
                )}

                {/* Modern Hover Overlay - Subtle, no text */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </motion.div>
    );
};

export function TemplatesSection({ templates, customers }: TemplatesSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter out invalid items just in case
    const validTemplates = useMemo(() => {
        return templates?.filter(t => t.project_view && t.project_view.url) || [];
    }, [templates]);

    return (
        <section ref={containerRef} className="relative z-10 w-full pt-24 pb-0 bg-black text-white">
            <div className="container mx-auto px-4 md:px-6 max-w-[1920px]">

                {/* Templates Grid - 5 Column Masonry Layout */}
                <div className="relative">
                    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 pb-32">
                        {validTemplates.map((item, index) => (
                            <TemplateCard key={item.project_view.ID || index} item={item} index={index} />
                        ))}
                    </div>
                    {/* Gradient Fade Overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />
                </div>

                {/* Customer Section */}
                {customers && customers.length > 0 && (
                    <div className="relative z-20 -mt-12 pb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col items-center"
                        >
                            <div className="flex w-full items-center justify-center flex-wrap gap-x-12 gap-y-8 px-4">
                                {customers.map((customer, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className="text-xl md:text-2xl font-bold text-gray-400 tracking-tight hover:text-white transition-colors duration-300 cursor-default select-none"
                                    >
                                        {customer.client_brand_name}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
}
