import { Metadata } from 'next';
import { CapabilitiesClient } from './CapabilitiesClient';
import { getHomePageData } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
    title: 'Capabilities | Axorah Global Company',
    description: 'Explore our comprehensive digital solutions and services, including Web Development, Mobile App Development, UI/UX Design, and Custom Software Development.',
};

export default async function CapabilitiesPage() {
    const data = await getHomePageData();

    if (!data) {
        return (
            <div className="flex items-center gap-4 flex-col justify-center h-screen bg-black text-white">
                <p>Failed to load data. Using fallback content.</p>
                <CapabilitiesClient />
            </div>
        );
    }

    const { acf } = data;

    return (
        <main className="min-h-screen bg-black">
            <Navbar navItems={acf.nav_bar} logo={acf.header_logo} />
            <CapabilitiesClient
                services={acf.services}
                sectionTitle={acf.section_main_title}
            />
        </main>
    );
}
