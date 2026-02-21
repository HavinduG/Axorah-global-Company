"use client";

import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ABOUT_DATA = {
    about_main_title: "Who we are",
    about_section_title: "Designing solutions for tomorrow.",
    about_small_description: "We turn ideas into powerful digital products that drive success",
    button_about: "Learn more",
    button_link_about: "",
    about_small_images_: [
        {
            about_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/01/91744-636709154_medium.mp4",
                mime_type: "video/mp4",
            },
            image_title: "Where Innovation Lives",
            image_descripation: "The Axorah Global office is more than just a place of work..."
        },
        {
            about_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/01/5364-183788428_medium.mp4",
                mime_type: "video/mp4",
            },
            image_title: "Turning Strategy into Digital Reality",
            image_descripation: "At Axorah Global, our portfolio is a reflection of our dedication..."
        },
        {
            about_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/01/273922_medium.mp4",
                mime_type: "video/mp4",
            },
            image_title: "The Architects of Your Digital Success",
            image_descripation: "Equipped with state-of-the-art infrastructure and the latest hardware..."
        },
        {
            about_image: {
                url: "http://axorah-global.local/wp-content/uploads/2026/01/141482-777708179_medium.mp4",
                mime_type: "video/mp4",
            },
            image_title: "Building with the Future in Mind",
            image_descripation: "At Axorah Global, we believe that the foundation of any great digital product..."
        }
    ]
};

export const AboutSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia(sectionRef);

        mm.add("(min-width: 1024px)", () => {
            if (!scrollContainerRef.current || !triggerRef.current) return;

            const scrollWidth = scrollContainerRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;

            // Calculate translation distance: Total width - visible portion (approx 60% of screen)
            // Or easier: scrollWidth - clientWidth of wrapper? 
            // Let's stick to the previous logic but ensure it recalculates
            const xMovement = -(scrollWidth - viewportWidth * 0.55);

            gsap.to(scrollContainerRef.current, {
                x: xMovement,
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 1,
                    // Use a function for end to handle resizes better
                    end: () => `+=${Math.abs(xMovement)}`,
                    invalidateOnRefresh: true,
                }
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-black text-white relative overflow-hidden">
            {/* 
                Desktop: Pinned Section Wrapper 
                Mobile: Normal flow
             */}
            <div ref={triggerRef} className="lg:h-screen lg:flex lg:items-center relative">

                {/* Left Content (Static/Pinned on Desktop) */}
                <div className="w-full lg:w-[40%] px-6 lg:px-20 py-24 lg:py-0 z-10 flex flex-col justify-center h-full">
                    <span className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-4 block">
                        {ABOUT_DATA.about_main_title}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8">
                        {ABOUT_DATA.about_section_title}
                    </h2>
                    <p className="text-xl text-gray-300 font-light mb-10 max-w-md">
                        {ABOUT_DATA.about_small_description}
                    </p>

                    <button className="group flex items-center gap-3 text-white border-b border-white pb-1 w-fit hover:opacity-70 transition-opacity">
                        <span className="text-lg">{ABOUT_DATA.button_about}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                {/* Right Scroll Track */}
                <div className="w-full lg:w-[60%] lg:h-full lg:absolute lg:right-0 lg:top-0 flex items-center overflow-x-auto lg:overflow-visible hide-scrollbar pb-12 lg:pb-0">
                    <div
                        ref={scrollContainerRef}
                        className="flex flex-row gap-4 px-6 lg:px-0 lg:gap-12 lg:pl-12"
                    >
                        {ABOUT_DATA.about_small_images_.map((item, index) => (
                            <div
                                key={index}
                                className="w-[85vw] md:w-[60vw] lg:w-[25vw] flex-shrink-0 group relative"
                            >
                                {/* Video/Image container */}
                                {/* Reduced height by changing aspect ratio from 9/16 to 3/4 */}
                                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 relative border border-white/10 mb-0">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10" />

                                    {/* Title Overlay - Pill Style */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                                            <span className="text-xs font-medium text-white tracking-wide uppercase">
                                                {item.image_title}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description Overlay - Appears on Hover */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                                            <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                                                {item.image_descripation.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                            </p>
                                        </div>
                                    </div>

                                    {/* Video */}
                                    <video
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        src={item.about_image.url}
                                        muted
                                        loop
                                        playsInline
                                        autoPlay
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                </div>
                            </div>
                        ))}
                        {/* Spacer for end of scroll */}
                        <div className="w-20 hidden lg:block flex-shrink-0" />
                    </div>
                </div>
            </div>
        </section>
    );
};
