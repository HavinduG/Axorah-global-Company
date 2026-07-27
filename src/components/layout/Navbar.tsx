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
          <Link
            href="#"
            className="text-white hover:text-white/80 text-[15px] font-medium"
          >
            Let's Talk
          </Link>
          <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 text-[15px] font-medium">
            Start
          </Button>
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
              <Link
                href="#"
                className="text-white/80 hover:text-white text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Button className="bg-white text-black hover:bg-white/90 rounded-full w-full font-medium">
                Start
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
