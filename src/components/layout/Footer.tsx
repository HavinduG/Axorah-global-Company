"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";

const contactDetails = [
    { title: "Address", text: "233/3 Magammana ,Homagama ,10200 , Sri Lanka", icon: MapPin },
    { title: "mail", text: "havindugayan@gmail.com", icon: Mail },
    { title: "phone number", text: "0704721009", icon: Phone }
];

const socialMediaLinks = [
    { name: "Facebook", url: "https://web.facebook.com/profile.php?id=100074296403446", icon: Facebook },
    { name: "Instagram", url: "https://www.instagram.com/havindu.gayan", icon: Instagram },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/havindu-ranathunga", icon: Linkedin }
];

const footerPageLinks = [
    { page_name: "Home", page_link: "/" },
    { page_name: "Capabilities", page_link: "/#capabilities" },
    { page_name: "About", page_link: "/#about" },
    { page_name: "Work", page_link: "/#work" },
    { page_name: "Contact", page_link: "/#contact" }
];

const supportLinks = [
    { support_link_name: "Privacy policy", support_link_url: "/privacy-policy" },
    { support_link_name: "Refund policy", support_link_url: "/refund-policy" },
    { support_link_name: "Terms & Conditions", support_link_url: "/terms-and-conditions" }
];

export const Footer = () => {
    return (
        <footer className="bg-black text-white pt-24 pb-8 border-t border-white/10 relative overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-900/50 to-transparent" />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

                    {/* Brand & Contact Column */}
                    <div className="lg:col-span-2 flex flex-col items-start justify-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link href="/" className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 block">
                                Axorah.
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                                Design smart, deliver fast. We build premium digital experiences that elevate brands and drive results.
                            </p>

                            {/* Contact Details beneath brand */}
                            <ul className="space-y-4">
                                {contactDetails.map((contact, idx) => {
                                    const Icon = contact.icon;
                                    return (
                                        <li key={idx} className="flex items-center gap-3 text-gray-400">
                                            <Icon size={18} />
                                            <span className="text-sm">{contact.text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Page Links Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col"
                    >
                        <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-6">Explore</h4>
                        <ul className="space-y-4">
                            {footerPageLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.page_link}
                                        className="text-gray-300 hover:text-white transition-colors text-sm hover:underline decoration-white/30 underline-offset-4"
                                    >
                                        {link.page_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support Links Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col"
                    >
                        <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-6">Legal</h4>
                        <ul className="space-y-4">
                            {supportLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.support_link_url}
                                        className="text-gray-300 hover:text-white transition-colors text-sm"
                                    >
                                        {link.support_link_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500"
                >
                    <p>© {new Date().getFullYear()} Axorah Global. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        {socialMediaLinks.map((social, idx) => {
                            const Icon = social.icon;
                            return (
                                <Link
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    aria-label={social.name}
                                >
                                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                                    <span className="sr-only">{social.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};
