import { getHomePageData, getProjects } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { TemplatesSection } from "@/components/home/TemplatesSection";
import { InteractiveScrollLayout } from "@/components/home/InteractiveScrollLayout";
import { AboutSection } from "@/components/home/AboutSection";
import { WorkSection } from "@/components/home/WorkSection";
import { FeedbackSection } from "@/components/home/FeedbackSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ShortSection } from "@/components/home/ShortSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZenonTec | IT Solutions & Digital Marketing Company in Sri Lanka",
  description:
    "ZenonTec is a Sri Lanka-based IT solutions and digital marketing company serving businesses worldwide. We build websites, software, e-commerce platforms, automation systems, and online growth campaigns.",
  keywords: [
    "IT solutions company Sri Lanka",
    "digital marketing company Sri Lanka",
    "website development Sri Lanka",
    "software development company Sri Lanka",
    "e-commerce website development",
    "digital marketing services worldwide",
    "web development company for startups",
  ],
};

export default async function Home() {
  const data = await getHomePageData();
  const projects = await getProjects();

  // Loading state or error handling could be improved here
  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>Failed to load content. Please check the WordPress connection.</p>
      </div>
    );
  }

  const { acf } = data;

  return (
    <main className="min-h-screen bg-black">
      <Navbar navItems={acf.nav_bar} logo={acf.header_logo} />

      {/* 
        The hero_section_ is an array in ACF (flexible content or repeater), 
        so we take the first item.
      */}
      {acf.hero_section_ && acf.hero_section_.length > 0 && (
        <Hero heroData={acf.hero_section_[0]} />
      )}

      {/* Templates Section */}
      <TemplatesSection
        templates={acf.project_templates}
        customers={acf.customers_}
      />

      {/* Interactive Scroll Section */}
      <InteractiveScrollLayout
        services={acf.services}
        sectionTitle={acf.section_main_title}
        sectionDescription={acf.capabilities_description}
      />

      {/* About Section */}
      <AboutSection
        aboutMainTitle={acf.about_main_title}
        aboutSectionTitle={acf.about_section_title}
        aboutSmallDescription={acf.about_small_description}
        buttonAbout={acf.button_about}
        buttonLinkAbout={acf.button_link_about}
        aboutSmallImages={acf.about_small_images_}
      />

      {/* Work Section */}
      <WorkSection
        workMainTitle={acf.work_main_title}
        worksTabs={acf.works_tabs}
      />

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <ProjectsSection projects={projects} />
      )}

      {/* Feedback Section */}
      <FeedbackSection
        title={acf.feed_back_title}
        subtitle={acf.feed_back_sub_title}
        feedbacks={acf.feedbacks}
      />

      {/* Short CTA Section */}
      <ShortSection
        title={acf.short_section_title}
        description={acf.short_section_description}
        ctaButtonText={acf.button_sub}
      />
    </main>
  );
}
