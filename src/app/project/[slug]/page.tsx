import { notFound } from "next/navigation";
import { getProjectBySlug, getHomePageData } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProjectPage(props: ProjectPageProps) {
    const params = await props.params;
    const project = await getProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    // Fetch home page data just to get the Navbar props correctly
    const homeData = await getHomePageData();
    const navItems = homeData?.acf?.nav_bar || [];
    const headerLogo = homeData?.acf?.header_logo ?? false;

    const { acf, title } = project;
    const displayTitle = title.rendered || acf.project_name;

    // Create a combined gallery from the single image + the gallery arrays to ensure there's media
    let allImages = acf.project_gallery || [];
    if (allImages.length === 0 && acf.project_image) {
        allImages = [acf.project_image];
    }

    const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="min-h-screen bg-black text-white selection:bg-white/30">
            {/* We reuse the Navbar, but without hero overlap if not needed. Or absolute atop. */}
            {/* It's usually safe to let Navbar position itself as it does on home */}
            <Navbar navItems={navItems} logo={headerLogo} />

            <div className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto pb-48">

                {/* Breadcrumbs and Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-400">Projects</span>
                        <span>/</span>
                        <span className="text-white truncate">{displayTitle}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h1
                            className="text-3xl md:text-5xl lg:text-5xl font-medium tracking-tight"
                            dangerouslySetInnerHTML={{ __html: displayTitle }}
                        />

                        <div className="flex items-center gap-4 shrink-0">
                            <Link
                                href="/"
                                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-16">
                    {allImages.map((img, idx) => (
                        <div
                            key={img.id || idx}
                            className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-white/5 border border-white/10 group group-hover:block"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img.url}
                                alt={img.alt || img.title}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        </div>
                    ))}
                </div>

                {/* Content Layout: Description on Left, Meta/Sidebar on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative items-start">

                    <div className="lg:col-span-8 prose prose-invert prose-lg max-w-none">
                        {acf.project_description ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: acf.project_description }}
                                className="[&>h2]:text-3xl [&>h2]:font-medium [&>h2]:mb-6 [&>h2]:mt-12 [&>h3]:text-2xl [&>p]:text-gray-300 [&>p]:leading-relaxed [&>ul]:text-gray-300 [&>ul>li]:mb-2 [&>hr]:border-white/10 [&>hr]:my-10"
                            />
                        ) : (
                            <p className="text-gray-400 italic">No description available for this project.</p>
                        )}
                    </div>

                    <div className="lg:col-span-4 space-y-8 sticky top-32">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-lg font-medium mb-6">Project Details</h3>

                            <ul className="space-y-4 text-sm">
                                <li className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-gray-500">Published</span>
                                    <span className="text-gray-200">{formattedDate}</span>
                                </li>
                                <li className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-gray-500">Status</span>
                                    <span className="text-gray-200 capitalize">{project.status}</span>
                                </li>
                                {acf.project_name && (
                                    <li className="flex justify-between items-center pb-2">
                                        <span className="text-gray-500">Client / Project</span>
                                        <span className="text-gray-200">{acf.project_name}</span>
                                    </li>
                                )}
                            </ul>

                            {/* Faux Call to action reflecting typical portfolio style */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <Link
                                    href="/#contact"
                                    className="block w-full py-4 rounded-xl bg-white text-black font-medium text-center hover:bg-gray-200 transition-colors"
                                >
                                    Start a Project Like This
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </main>
    );
}
