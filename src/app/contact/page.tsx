import { getHomePageData } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { ContactHero } from "@/components/contact/ContactHero";
import { Contact3DHero } from "@/components/contact/Contact3DHero";

export const metadata = {
    title: "Contact Us | Axorah Global",
    description: "Get in touch with Axorah Global. We are ready to elevate your digital presence and build something extraordinary.",
};

export default async function ContactPage() {
    // Fetch data for the Navbar from the homepage data
    const homeData = await getHomePageData();

    if (!homeData) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <p>Failed to load contact content.</p>
            </div>
        );
    }

    const { acf } = homeData;

    return (
        <main className="min-h-screen bg-black">
            {/* Nav */}
            <Navbar navItems={acf.nav_bar} logo={acf.header_logo} />

            {/* 3D Gravity Well Hero Section with Contact Form */}
            <Contact3DHero />

            {/* Contact Hero Section / Details */}
            <ContactHero acfData={acf} />
        </main>
    );
}
