import { Metadata } from "next";
import { ServicesClient } from "./ServicesClient";
import { getHomePageData } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "IT Solutions & Digital Marketing Services | ZenonTec Sri Lanka",
  description:
    "ZenonTec provides web development, app development, software systems, SEO, social media marketing, paid ads, creative design, lead generation, and digital growth services for businesses in Sri Lanka and worldwide.",
};

// Fallback service sections
const FALLBACK_SERVICE_SECTIONS = [
  {
    acf_fc_layout: "service_sections",
    main_title: "Our Service Approach",
    service_description:
      "<h3><strong>01. Understand</strong></h3><p>We first understand your business, goals, target audience, current challenges, and expected outcome. This helps us recommend the right digital solution instead of offering a generic service.</p><h3><strong>02. Plan</strong></h3><p>We prepare a clear strategy, service scope, content direction, project timeline, and digital growth plan. This stage helps align the project with your business goals.</p><h3><strong>03. Build</strong></h3><p>We design, develop, create, or set up the required solution, whether it is a website, app, software system, SEO structure, campaign, or creative content plan.</p><h3><strong>04. Launch</strong></h3><p>We test, optimize, and launch the project with the required tracking, forms, integrations, and call-to-action flow.</p><h3><strong>05. Grow</strong></h3><p>After launch, we support ongoing improvements through SEO, content, ads, campaign optimization, inquiry tracking, reporting, and digital growth recommendations.</p>",
  },
  {
    acf_fc_layout: "service_sections",
    main_title: "Industries We Serve",
    service_description:
      "<p>ZenonTec works with businesses across different industries that need strong digital presence, professional systems, and quality lead generation.</p><p>Healthcare and medical services<br />Aesthetic clinics and beauty brands<br />Wedding planning and photography<br />Cargo and logistics<br />Restaurants and food businesses<br />Baby and kids clothing<br />E-commerce brands<br />IT and technology companies<br />Business setup and corporate services<br />Education and training businesses<br />Professional service providers<br />Startups and SMEs<br />Local Sri Lankan businesses<br />UAE-based businesses<br />Global service brands</p>",
  },
  {
    acf_fc_layout: "service_sections",
    main_title: "Why Choose ZenonTec?",
    service_description:
      "<h3>Sri Lanka-based, serving worldwide</h3>\n<p>ZenonTec is based in Sri Lanka and supports clients across Sri Lanka, UAE, and international markets.</p>\n<h3>One team for technology and growth</h3>\n<p>We combine website development, app development, software systems, SEO, digital marketing, paid<br />\ncampaigns, creative design, and lead generation under one digital growth approach.</p>\n<h3>Built for real business results</h3>\n<p>Our focus is not only to design beautiful websites or create posts. We build digital solutions that help<br />\nbusinesses increase visibility, generate inquiries, improve sales, and manage operations better.</p>\n<h3>Practical and clear communication</h3>\n<p>We explain the process clearly and help clients understand what needs to be done, why it matters, and how<br />\nit supports business growth.</p>\n<h3>Experience across multiple industries</h3>\n<p>ZenonTec has handled projects across healthcare, beauty, wedding, cargo, restaurant, clothing, IT, business<br />\nsetup, e-commerce, and service-based industries.</p>\n<h3>Growth-focused delivery</h3>\n<p>Every project is planned around clear goals such as website traffic, brand awareness, customer inquiries,<br />\nonline sales, lead conversion, or operational efficiency.</p>\n<p>&nbsp;</p>\n",
  },
  {
    acf_fc_layout: "service_sections",
    main_title: "Frequently Asked Questions",
    service_description:
      "<h3><strong>Do you work only with Sri Lankan clients?</strong></h3>\n<p>No. ZenonTec is based in Sri Lanka, but we provide services to clients in Sri Lanka, UAE, and worldwide.</p>\n<h3>Can you build a website and also manage marketing?</h3>\n<p>Yes. We can build your website and also support SEO, social media, paid ads, content planning, and lead<br />\ngeneration after launch.</p>\n<h3>Do you provide SEO services?</h3>\n<p>Yes. We provide keyword research, on-page SEO, meta titles, meta descriptions, technical SEO guidance,<br />\ncontent structure, internal linking, image alt text, local SEO, and Google Search Console setup.</p>\n<h3>Can you manage social media pages?</h3>\n<p>Yes. We support Facebook, Instagram, TikTok, YouTube, and LinkedIn content planning, creative artwork,<br />\ncampaign direction, and platform management.</p>\n<h3>Do you run paid ads?</h3>\n<p>Yes. We support Meta ads, Google ads, TikTok ads, lead generation campaigns, WhatsApp inquiry<br />\ncampaigns, website traffic campaigns, and conversion campaigns.</p>\n<h3>Can you help with WhatsApp inquiries and lead handling?</h3>\n<p>Yes. We provide inquiry tracking support, WhatsApp reply guidance, customer follow-up structure, CRM<br />\nguidance, and lead conversion consultation.</p>\n<h3>Do you build custom software?</h3>\n<p>Yes. We build CRM systems, ERP systems, POS systems, dashboards, booking systems, ordering systems,<br />\nautomation tools, and custom business applications.</p>\n<h3>Can you create artwork for ads and social media?</h3>\n<p>Yes. We create social media artwork, ad creatives, campaign designs, service posters, offer posts, reel<br />\ncovers, website banners, and brand visuals.</p>\n<h3>Do you provide monthly support?</h3>\n<p>Yes. We can provide monthly support for website updates, SEO, social media management, paid ads,<br />\ncampaign optimization, reporting, and inquiry improvement.</p>\n<h3>How can we start a project?</h3>\n<p>You can contact ZenonTec with your business details, goals, required service, timeline, and budget. Our<br />\nteam will review your needs and recommend the best solution.</p>\n",
  },
];

export default async function ServicesPage() {
  const data = await getHomePageData();

  if (!data) {
    return (
      <div className="flex items-center gap-4 flex-col justify-center h-screen bg-black text-white">
        <p>Failed to load data. Using fallback content.</p>
        <ServicesClient />
      </div>
    );
  }

  const { acf } = data;

  return (
    <main className="min-h-screen bg-black">
      <Navbar navItems={acf.nav_bar} logo={acf.header_logo} />
      <ServicesClient
        services={acf.services}
        sectionTitle={acf.section_main_title}
        sectionDescription={acf.capabilities_description}
        serviceSections={acf.service_sections || FALLBACK_SERVICE_SECTIONS}
        ctaSectionTitle={acf.cta_section}
        ctaDescription={acf.cta_description}
        btn1Text={acf.button_1}
        btn1Url={acf.button_1_url}
        btn2Text={acf.button_2}
        btn2Url={acf.button_2_url}
      />
    </main>
  );
}
