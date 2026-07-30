"use client";

import React, { useState, useCallback } from "react";
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
  feedbacks = [],
}: FeedbackSectionProps) => {
  if (!feedbacks || feedbacks.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure we have at least 3 items to show left/center/right for the 3D effect
  const displayFeedbacks =
    feedbacks.length > 0 && feedbacks.length < 3
      ? [...feedbacks, ...feedbacks, ...feedbacks]
      : feedbacks;

  const total = displayFeedbacks.length;

  const paginate = useCallback(
    (newDirection: number) => {
      setActiveIndex((prev) => (prev + newDirection + total) % total);
    },
    [total],
  );

  const getCardState = (index: number) => {
    if (total <= 1) return "active";

    let offset = index - activeIndex;
    // Handle wrap around for infinite loop
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    if (offset === 0) return "active";
    if (offset === 1 || (offset > 0 && total === 2)) return "right";
    if (offset === -1 || (offset < 0 && total === 2)) return "left";
    return offset > 0 ? "hiddenRight" : "hiddenLeft";
  };

  const variants = {
    active: {
      x: "0%",
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 20,
    },
    left: {
      x: "-105%",
      scale: 0.85,
      opacity: 0.3,
      filter: "blur(4px)",
      zIndex: 10,
    },
    right: {
      x: "105%",
      scale: 0.85,
      opacity: 0.3,
      filter: "blur(4px)",
      zIndex: 10,
    },
    hiddenRight: {
      x: "150%",
      scale: 0.5,
      opacity: 0,
      filter: "blur(8px)",
      zIndex: 0,
    },
    hiddenLeft: {
      x: "-150%",
      scale: 0.5,
      opacity: 0,
      filter: "blur(8px)",
      zIndex: 0,
    },
  };

  return (
    <section className="bg-black text-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
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
      </div>

      {/* Slider / Marquee */}
      <div className="relative w-full mt-6 max-w-7xl mx-auto px-6 lg:px-20 h-95 md:h-80 flex items-center justify-center">
        {displayFeedbacks.map((item, index) => {
          const state = getCardState(index);
          return (
            <motion.div
              key={`feedback-${index}`}
              variants={variants}
              initial={false}
              animate={state}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => {
                if (state === "left") paginate(-1);
                if (state === "right") paginate(1);
              }}
              drag={state === "active" ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, { offset }) => {
                if (offset.x < -50) {
                  paginate(1);
                } else if (offset.x > 50) {
                  paginate(-1);
                }
              }}
              className={cn(
                "absolute h-full w-[320px] sm:w-100 md:w-112.5",
                state === "active"
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-pointer",
              )}
            >
              {/* Card Background & Border Effect */}
              <div className="absolute inset-0 bg-[#0a0a0a] rounded-2xl border border-white/5 shadow-2xl" />
              <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
                {/* Decorative Quote Icon Top Right */}
                <div className="absolute top-6 right-6 text-[#1a1a1a] pointer-events-none">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                  </svg>
                </div>

                {/* Feedback Text */}
                <div className="mb-6 relative z-10">
                  <p className="text-[#a1a1aa] text-base md:text-lg leading-relaxed font-light italic pr-8">
                    &quot;{item.client_feedback}&quot;
                  </p>
                </div>

                {/* Client Info */}
                <div className="flex items-center gap-4 mt-auto relative z-10">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.client_image.url}
                      alt={item.client_image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base tracking-wide">
                      {item.client_name}
                    </h4>
                    <p className="text-[#71717a] text-xs font-medium mt-0.5">
                      {item.client_position}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      {total > 1 && (
        <div className="flex justify-center gap-3 mt-12">
          {displayFeedbacks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                // Calculate direction to minimize jumps
                let offset = idx - activeIndex;
                if (offset > Math.floor(total / 2)) offset -= total;
                if (offset < -Math.floor(total / 2)) offset += total;
                paginate(offset);
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                activeIndex === idx
                  ? "bg-white w-8"
                  : "bg-white/20 hover:bg-white/40",
              )}
              aria-label={`Go to feedback ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
