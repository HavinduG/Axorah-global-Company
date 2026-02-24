import { getHomePageData, getProjects } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { WorkSection } from "@/components/home/WorkSection";
import Link from "next/link";
import { WordPressProject } from "@/lib/types";

// This will help stagger or animate items gracefully on scroll
import { WorkGrid } from "@/components/work/WorkGrid";

export const metadata = {
    title: "Our Work | Axorah Global",
    description: "Explore our portfolio of cutting-edge creative and digital projects.",
};

export default async function WorkPage() {
    // Fetch data for the Navbar and Work Section from the homepage data
    const homeData = await getHomePageData();

    // Fetch all dynamic projects
    const projects = await getProjects();

    if (!homeData || !projects) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <p>Failed to load work content.</p>
            </div>
        );
    }

    const { acf } = homeData;

    return (
        <main className="min-h-screen bg-black">
            {/* Nav */}
            <Navbar navItems={acf.nav_bar} logo={acf.header_logo} />

            {/* Main Premium Work Slider from Home Page */}
            <div className="pt-20">
                <WorkSection
                    workMainTitle={acf.work_main_title}
                    worksTabs={acf.works_tabs}
                />
            </div>

            {/* Dynamic Interactive Grid of ALL Projects */}
            <WorkGrid projects={projects} />
        </main>
    );
}
