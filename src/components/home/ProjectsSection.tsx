"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { WordPressProject } from "@/lib/types";
import { motion } from "framer-motion";

interface ProjectsSectionProps {
  projects: WordPressProject[];
}

export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  // For infinite marquee, we duplicate the list so it scrolls seamlessly.
  // We only duplicate if there are projects.
  const displayProjects = [...projects, ...projects, ...projects];

  return (
    <section className="bg-black text-white py-12 md:py-16 overflow-hidden flex flex-col justify-center min-h-screen lg:min-h-[90vh]">
      <div className="max-w-350 mx-auto w-full px-6 lg:px-12 mb-8 md:mb-10">
        <div className="flex flex-col gap-3 md:gap-4 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-medium tracking-tight whitespace-nowrap"
          >
            Live Projects & Client Websites
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl"
          >
            Explore selected websites, brands, and digital platforms developed
            or supported by ZenonTec across Sri Lanka, UAE, and international
            markets.
          </motion.p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex flex-col gap-8">
        {/* Marquee Container */}
        <div className="flex group w-full overflow-hidden">
          {Array.from({ length: 2 }).map((_, trackIdx) => (
            <div
              key={`track-${trackIdx}`}
              className="flex shrink-0 gap-6 pr-6 animate-marquee group-hover:[animation-play-state:paused] will-change-transform"
              aria-hidden={trackIdx === 1}
            >
              {displayProjects.map((project, idx) => {
                // Get the best image available, default to a placeholder logic if empty
                const imageUrl =
                  project.acf?.project_image?.url ||
                  project.acf?.project_gallery?.[0]?.url;
                const title =
                  project.title?.rendered || project.acf?.project_name;

                return (
                  <Link
                    href={`/project/${project.slug}`}
                    key={`track${trackIdx}-${project.id}-${idx}`}
                    className="block shrink-0 w-65 sm:w-[320px] md:w-100 lg:w-112.5 group/card"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-zinc-900 border border-white/10">
                      {imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={title}
                          className="object-contain w-full h-full transition-transform duration-700 group-hover/card:scale-105"
                        />
                      )}
                      {/* Optional hover overlay, e.g., a zoom icon */}
                      <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 transform scale-75 group-hover/card:scale-100">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium text-lg text-white mb-1 group-hover/card:text-gray-300 transition-colors">
                      {title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-350 mx-auto w-full px-6 lg:px-12 mt-8 md:mt-10 flex justify-start">
        <Link
          href="/work"
          className="group flex items-center gap-3 text-white border-b border-white pb-1 w-fit hover:opacity-70 transition-opacity"
        >
          <span className="text-base md:text-lg">See all</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      {/* Internal styling for marquee to ensure it works without custom tailwind config */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee ${Math.max(displayProjects.length * 10, 40)}s linear infinite;
        }
      `,
        }}
      />
    </section>
  );
};
