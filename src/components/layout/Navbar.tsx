"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AcfNavBarItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  navItems: AcfNavBarItem[];
  logo?: false | string | { url: string; alt?: string; [key: string]: unknown };
}

export function Navbar({ navItems, logo }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Determine the logo URL
  let logoUrl =
    "https://web.zenontec.com/wp-content/uploads/2026/07/Axorah-Global-logo-1-copy.png"; // Fallback
  if (typeof logo === "string" && logo.trim() !== "") {
    logoUrl = logo;
  } else if (typeof logo === "object" && logo?.url) {
    logoUrl = logo.url;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center">
          <img
            src={logoUrl}
            alt={
              typeof logo === "object" && logo?.alt ? logo.alt : "Axorah Global"
            }
            className="h-12 md:h-16 lg:h-20 w-auto object-contain transform scale-125 md:scale-150 origin-left"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => {
            const isHome = item.menu_page_name.trim().toLowerCase() === "home";
            let pathToCheck =
              item.page_link ||
              (isHome ? "/" : `/${item.menu_page_name.trim().toLowerCase()}`);
            try {
              if (pathToCheck.startsWith("http")) {
                pathToCheck = new URL(pathToCheck).pathname;
              }
            } catch (e) {}

            const currentPath = pathname || "/";
            const isActive =
              (isHome && currentPath === "/") ||
              (pathToCheck === "/"
                ? currentPath === "/"
                : currentPath.startsWith(pathToCheck));

            const href =
              item.page_link ||
              (isHome ? "/" : `/${item.menu_page_name.trim().toLowerCase()}`);

            return (
              <Link
                key={index}
                href={href}
                className={`relative text-[15px] font-medium transition-colors py-2 ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {item.menu_page_name}
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="https://wa.me/94775053300"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 text-[15px] font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.45 3.42 1.25 4.88L2 22l5.31-1.18c1.42.74 3.03 1.18 4.68 1.18 5.52 0 10-4.48 10-10S17.51 2 11.99 2zm0 18.06c-1.46 0-2.88-.38-4.14-1.09l-.3-.17-3.08.68.69-3.03-.2-.31A8.044 8.044 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8.06-8.01 8.06zm4.39-5.96c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.04-.7-.52-1.17-1.16-1.31-1.4-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.34.98 2.5c.12.16 1.7 2.6 4.12 3.6.58.24 1.03.38 1.38.49.58.18 1.11.16 1.53.1.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
            </svg>
            Let's Talk
          </a>
          <Link href="/work">
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 text-[15px] font-medium">
              Start
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 md:hidden flex flex-col p-6 space-y-4"
          >
            {navItems.map((item, index) => {
              const isHome =
                item.menu_page_name.trim().toLowerCase() === "home";
              let pathToCheck =
                item.page_link ||
                (isHome ? "/" : `/${item.menu_page_name.trim().toLowerCase()}`);
              try {
                if (pathToCheck.startsWith("http")) {
                  pathToCheck = new URL(pathToCheck).pathname;
                }
              } catch (e) {}

              const currentPath = pathname || "/";
              const isActive =
                (isHome && currentPath === "/") ||
                (pathToCheck === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(pathToCheck));

              const href =
                item.page_link ||
                (isHome ? "/" : `/${item.menu_page_name.trim().toLowerCase()}`);

              return (
                <Link
                  key={index}
                  href={href}
                  className={`text-lg font-medium transition-colors flex items-center gap-2 ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white transition-opacity" />
                  )}
                  {item.menu_page_name}
                </Link>
              );
            })}
            <div className="border-t border-white/10 pt-4 flex flex-col space-y-4">
              <a
                href="https://wa.me/94775053300"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white text-lg font-medium flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.45 3.42 1.25 4.88L2 22l5.31-1.18c1.42.74 3.03 1.18 4.68 1.18 5.52 0 10-4.48 10-10S17.51 2 11.99 2zm0 18.06c-1.46 0-2.88-.38-4.14-1.09l-.3-.17-3.08.68.69-3.03-.2-.31A8.044 8.044 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8.06-8.01 8.06zm4.39-5.96c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.04-.7-.52-1.17-1.16-1.31-1.4-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.34.98 2.5c.12.16 1.7 2.6 4.12 3.6.58.24 1.03.38 1.38.49.58.18 1.11.16 1.53.1.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
                </svg>
                Let's Talk
              </a>
              <Link href="/work" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-white text-black hover:bg-white/90 rounded-full w-full font-medium">
                  Start
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
