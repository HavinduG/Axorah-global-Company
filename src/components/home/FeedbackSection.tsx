"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { AcfFeedbackItem } from "@/lib/types";

interface FeedbackSectionProps {
    title?: string;
    subtitle?: string;
    feedbacks?: AcfFeedbackItem[];
}

export const FeedbackSection = ({
    title = "Trusted partnerships and successful collaborations",
    subtitle = "We’re true partners not vendors. Our relationships with our clients are long term and rewarding don’t take our word for it.",
    feedbacks = []
}: FeedbackSectionProps) => {
    if (!feedbacks || feedbacks.length === 0) return null;

    return (
        <section className="bg-black text-white py-24 px-6 lg:px-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {feedbacks.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="group relative h-full"
                        >
                            {/* Card Background & Border Effect */}
                            <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm transform group-hover:scale-[1.02] transition-transform duration-500" />
                            <div className="relative h-full bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-colors duration-300 flex flex-col justify-between">

                                {/* Feedback Text */}
                                <div className="mb-8">
                                    <p className="text-gray-300 text-lg leading-relaxed font-light italic">
                                        &quot;{item.client_feedback}&quot;
                                    </p>
                                </div>

                                {/* Client Info */}
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.client_image.url}
                                            alt={item.client_image.alt}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-base">
                                            {item.client_name}
                                        </h4>
                                        <p className="text-gray-500 text-sm">
                                            {item.client_position}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative Element */}
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                                    </svg>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
