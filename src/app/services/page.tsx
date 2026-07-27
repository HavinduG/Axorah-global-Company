import { Metadata } from 'next';
import { ServicesClient } from './ServicesClient';
import { getHomePageData } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
    title: 'IT Solutions & Digital Marketing Services | ZenonTec Sri Lanka',
    description: 'ZenonTec provides web development, app development, software systems, SEO, social media marketing, paid ads, creative design, lead generation, and digital growth services for businesses in Sri Lanka and worldwide.',
};

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
            />
        </main>
    );
}
