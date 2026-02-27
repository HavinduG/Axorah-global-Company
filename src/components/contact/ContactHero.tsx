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
            className="relative w-full min-h-screen bg-black overflow-hidden flex items-center pt-32 pb-20 justify-center"
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
                        Ready to elevate your digital presence? We're here to turn your vision into an exceptional reality.
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
        </section>
    );
};
