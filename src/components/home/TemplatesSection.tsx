"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { AcfProjectTemplateItem, AcfCustomerItem } from "@/lib/types";

interface TemplatesSectionProps {
  templates: AcfProjectTemplateItem[];
  customers: AcfCustomerItem[];
}

const TemplateCard = ({
  item,
  index,
}: {
  item: AcfProjectTemplateItem;
  index: number;
}) => {
  const isVideo = item.project_view.mime_type === "video/mp4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative rounded-xl overflow-hidden group cursor-pointer w-full"
    >
      <div className="relative w-full bg-gray-900/20 overflow-hidden rounded-xl">
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

        {/* Modern Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

export function TemplatesSection({
  templates,
  customers,
}: TemplatesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1920);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter out invalid items just in case
  const validTemplates = useMemo(() => {
    return templates?.filter((t) => t.project_view && t.project_view.url) || [];
  }, [templates]);

  // Distribute into 5 columns
  const columns = useMemo(() => {
    const cols: AcfProjectTemplateItem[][] = Array.from(
      { length: 5 },
      () => [],
    );
    validTemplates.forEach((item, i) => {
      cols[i % 5].push(item);
    });
    return cols;
  }, [validTemplates]);

  // Determine section height based on template count
  const sectionHeight = useMemo(() => {
    if (validTemplates.length < 10) return "150vh";
    if (validTemplates.length < 20) return "200vh";
    return "250vh";
  }, [validTemplates.length]);

  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Different translation speeds for each column to create parallax
  const y1 = useTransform(springProgress, [0, 1], ["0%", "-30%"]);
  const y2 = useTransform(springProgress, [0, 1], ["-10%", "-45%"]);
  const y3 = useTransform(springProgress, [0, 1], ["0%", "-60%"]);
  const y4 = useTransform(springProgress, [0, 1], ["-5%", "-40%"]);
  const y5 = useTransform(springProgress, [0, 1], ["0%", "-50%"]);

  const transforms = [y1, y2, y3, y4, y5];

  // Customer section fade up (appears in the last 25% of scroll)
  const customerOpacity = useTransform(springProgress, [0.75, 1], [0, 1]);
  const customerY = useTransform(springProgress, [0.75, 1], [50, 0]);

  // Number of columns to show based on screen width
  const numColumns =
    windowWidth >= 1280
      ? 5
      : windowWidth >= 1024
        ? 4
        : windowWidth >= 768
          ? 3
          : 2;

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full bg-black text-white"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Background glow for luxury feel */}
        <div className="absolute inset-0 bg-black z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Parallax Grid */}
        <div className="absolute inset-0 z-10 flex gap-4 md:gap-6 px-4 md:px-6 items-start justify-center pt-32 pb-32 opacity-90 hover:opacity-100 transition-opacity duration-700">
          {columns.slice(0, numColumns).map((col, i) => (
            <motion.div
              key={i}
              className="flex flex-col gap-4 md:gap-6 w-full max-w-[400px]"
              style={{ y: transforms[i] }}
            >
              {col.map((item, j) => (
                <TemplateCard
                  key={item.project_view.ID || j}
                  item={item}
                  index={j}
                />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Top and Bottom Fade Overlays */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[45vh] bg-gradient-to-t from-black via-black/95 to-transparent z-20 pointer-events-none flex items-end justify-center pb-12 md:pb-24">
          {/* Customer Section placed inside the bottom fade */}
          {customers && customers.length > 0 && (
            <motion.div
              style={{ opacity: customerOpacity, y: customerY }}
              className="relative z-30 w-full max-w-5xl mx-auto px-4 pointer-events-auto"
            >
              <div className="p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-[0_0_60px_rgba(255,255,255,0.05)]">
                <div className="text-center mb-8">
                  <h3 className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-400 font-medium">
                    Trusted by growing brands across Sri Lanka, UAE & global
                    markets
                  </h3>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-8">
                  {customers.map((customer, index) => (
                    <div
                      key={index}
                      className="text-lg md:text-2xl font-bold text-white/50 hover:text-white transition-colors duration-300 cursor-default select-none"
                    >
                      {customer.client_brand_name}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
