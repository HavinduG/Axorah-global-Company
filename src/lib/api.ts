import { WordPressPage, WordPressProject } from './types';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function getHomePageData(): Promise<WordPressPage | null> {
    // Check if URL is defined to avoid runtime errors
    if (!WORDPRESS_API_URL) {
        console.error('NEXT_PUBLIC_WORDPRESS_URL is not defined in environment variables');
        return null;
    }

    try {
        // Determine the API endpoint. We'll generically fetch pages with slug 'home' first
        // If that fails or returns empty, we might need a specific ID, but slug is safer for general use.
        const res = await fetch(`${WORDPRESS_API_URL}wp-json/wp/v2/pages?slug=home`, {
            next: { revalidate: 60 }, // Revalidate every 60 seconds
        });

        if (!res.ok) {
            // Fallback for when the specific page slug might be different or API error
            console.error('Failed to fetch home page data:', res.statusText);
            return null;
        }

        const pages: WordPressPage[] = await res.json();

        if (pages.length === 0) {
            console.warn('No page with slug "home" found.');
            return null;
        }

        return pages[0]; // Return the first matching page
    } catch (error) {
        console.error('Error fetching home page data:', error);
        return null;
    }
}

export async function getProjects(): Promise<WordPressProject[]> {
    if (!WORDPRESS_API_URL) {
        console.error('NEXT_PUBLIC_WORDPRESS_URL is not defined');
        return [];
    }

    try {
        const res = await fetch(`${WORDPRESS_API_URL}wp-json/wp/v2/project?_embed&per_page=100`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            console.error('Failed to fetch projects');
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

export async function getProjectBySlug(slug: string): Promise<WordPressProject | null> {
    if (!WORDPRESS_API_URL) {
        console.error('NEXT_PUBLIC_WORDPRESS_URL is not defined');
        return null;
    }

    try {
        const res = await fetch(`${WORDPRESS_API_URL}wp-json/wp/v2/project?slug=${slug}&_embed`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            console.error(`Failed to fetch project with slug ${slug}`);
            return null;
        }

        const projects: WordPressProject[] = await res.json();
        if (projects.length === 0) return null;

        return projects[0];
    } catch (error) {
        console.error(`Error fetching project with slug ${slug}:`, error);
        return null;
    }
}
