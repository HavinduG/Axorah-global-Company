import { WordPressPage } from './types';

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
