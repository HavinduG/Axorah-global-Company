'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { AcfData } from "@/lib/types";

// Fallback Data
const fallbackContactDetails = [
    { title: "Address", value: "233/3 Magammana ,Homagama ,10200 , Sri Lanka", href: null },
    { title: "Mail", value: "havindugayan@gmail.com", href: "mailto:havindugayan@gmail.com" },
    { title: "Phone Number", value: "0704721009", href: "tel:0704721009" }
];

const fallbackSocialMedias = [
    { name: "facebook", link: "https://web.facebook.com/profile.php?id=100074296403446" },
    { name: "instagram", link: "https://www.instagram.com/havindu.gayan" },
    { name: "linkedin", link: "https://www.linkedin.com/in/havindu-ranathunga" }
];

interface ContactHeroProps {
    acfData?: AcfData;
}

export const ContactHero = ({ acfData }: ContactHeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    // Use dynamic data with fallbacks
    const contacts = acfData?.contact_details || fallbackContactDetails.map(c => ({
        contact_detail_title: c.title,
        contact_image: { url: "" },
        contact_details_: c.value
    }));

    const socials = acfData?.social_media || fallbackSocialMedias.map(s => ({
        social_media_icon: { url: "" },
        social_media_link: s.link,
        social_media_name: s.name
    }));

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center pt-32 pb-20 justify-center"
        >
            {/* Dynamic Interactive Glow */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full bg-[#a78bfa]/10 blur-[150px] pointer-events-none"
                animate={{
                    x: mousePosition.x - 400,
                    y: mousePosition.y - 400,
                }}
                transition={{ type: "spring", stiffness: 30, damping: 20, mass: 1 }}
            />

            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Left Side: Headline & Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col"
                >
                    <span className="text-sm md:text-base font-medium tracking-widest text-[#a78bfa] uppercase mb-6 flex items-center gap-2">
                        <span className="w-10 h-[1px] bg-[#a78bfa]"></span> Contact Us
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.05]">
                        Let's Work <br />
                        <span className="text-[#a78bfa]">
                            Together.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl leading-relaxed">
                     Ready to elevate your digital presence? ZenonTec helps businesses in Sri Lanka and worldwide build
websites, software systems, e-commerce platforms, SEO strategies, digital campaigns, and lead generation
systems that support real business growth.

                    </p>
                </motion.div>

                {/* Right Side: Contact Information Cards */}
                <div className="flex flex-col gap-6">
                    {/* Contact Detail Cards */}
                    <div className="space-y-4">
                        {contacts.map((contact, index) => {
                            const titleStr = (contact.contact_detail_title || "").toLowerCase();
                            let href: string | null = null;
                            let IconComponent = MapPin;

                            if (titleStr.includes("mail") || titleStr.includes("email")) {
                                href = `mailto:${contact.contact_details_}`;
                                IconComponent = Mail;
                            } else if (titleStr.includes("phone") || titleStr.includes("call")) {
                                href = `tel:${contact.contact_details_}`;
                                IconComponent = Phone;
                            }

                            const Card = (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                                    className="p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl transition-colors duration-300 group flex items-start gap-6 cursor-pointer transform group-hover:-translate-y-1 group-hover:shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                                    key={index}
                                >
                                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#a78bfa]/10 group-hover:border-[#a78bfa]/30 transition-all duration-500 text-gray-400 group-hover:text-[#a78bfa]">
                                        {contact.contact_image?.url ? (
                                            <img src={contact.contact_image.url} alt={contact.contact_detail_title} className="w-6 h-6 object-contain invert opacity-80 group-hover:opacity-100" />
                                        ) : (
                                            <IconComponent size={24} />
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center gap-1">
                                        <h3 className="text-sm uppercase tracking-widest text-[#a78bfa]/80 font-medium">{contact.contact_detail_title}</h3>
                                        <p className="text-lg md:text-xl text-white font-light group-hover:text-[#a78bfa] transition-colors">{contact.contact_details_}</p>
                                    </div>
                                </motion.div>
                            );

                            if (href) {
                                return (
                                    <Link href={href} key={index} target={href.startsWith('mailto') || href.startsWith('tel') ? '_self' : '_blank'}>
                                        {Card}
                                    </Link>
                                );
                            }
                            return <div key={index}>{Card}</div>;
                        })}
                    </div>

                    {/* Social Media Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl mt-4"
                    >
                        <h3 className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-6">Follow Us</h3>
                        <div className="flex gap-6">
                            {socials.map((social, index) => {
                                const linkUrl = social.social_media_link;
                                const linkStr = (linkUrl || "").toLowerCase();
                                let IconComponent = Linkedin; // default
                                if (linkStr.includes("facebook")) IconComponent = Facebook;
                                else if (linkStr.includes("instagram")) IconComponent = Instagram;

                                return (
                                    <Link href={linkUrl || "#"} key={index} target="_blank" rel="noopener noreferrer">
                                        <motion.div
                                            whileHover={{ y: -5, scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#a78bfa]/30 transition-all duration-300 shadow-lg hover:shadow-[#a78bfa]/20 text-gray-400 group"
                                        >
                                            {social.social_media_icon?.url ? (
                                                <img src={social.social_media_icon.url} alt={"Social Profile"} className="w-6 h-6 filter invert opacity-80 group-hover:opacity-100" />
                                            ) : (
                                                <IconComponent size={24} className="group-hover:text-[#a78bfa] transition-colors duration-300" />
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* WhatsApp CTA Card - Final Section */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="w-full p-8 md:p-12 rounded-3xl border border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/10 via-black to-black backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(37,211,102,0.05)]"
                >
                    {/* Glowing effect inside card */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(37,211,102,0.15),transparent_50%)] pointer-events-none" />

                    <div className="flex flex-col gap-4 max-w-2xl relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            Prefer a quick chat?
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed font-light">
                            Message us directly on WhatsApp and tell us what you need. Our team can guide you with the right solution for your website, software, SEO, digital marketing, or lead generation requirement.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto shrink-0">
                        <a
                            href="https://wa.me/94775053300"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto bg-[#25D366] text-black font-semibold rounded-full px-8 py-4 flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,211,102,0.3)] group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 group-hover:rotate-12 transition-transform">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.45 3.42 1.25 4.88L2 22l5.31-1.18c1.42.74 3.03 1.18 4.68 1.18 5.52 0 10-4.48 10-10S17.51 2 11.99 2zm0 18.06c-1.46 0-2.88-.38-4.14-1.09l-.3-.17-3.08.68.69-3.03-.2-.31A8.044 8.044 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8.06-8.01 8.06zm4.39-5.96c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.04-.7-.52-1.17-1.16-1.31-1.4-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.34.98 2.5c.12.16 1.7 2.6 4.12 3.6.58.24 1.03.38 1.38.49.58.18 1.11.16 1.53.1.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
                            </svg>
                            <span className="text-lg">Chat on WhatsApp</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
