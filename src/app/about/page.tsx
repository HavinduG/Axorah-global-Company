import { getHomePageData } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import AboutClient from './AboutClient';

export default async function AboutPage() {
    const data = await getHomePageData();

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
            <AboutClient
                mainTitle={acf.about_main_title}
                sectionTitle={acf.about_section_title}
                smallDescription={acf.about_small_description}
                images={acf.about_small_images_}
            />
        </main>
    );
}
