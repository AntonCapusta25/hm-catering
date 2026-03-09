import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Blog & Insights | Homemade Catering",
    description: "Read the latest tips, tricks, and behind-the-scenes stories from the Homemade Chefs team.",
};

import { BLOG_POSTS_I18N } from "@/lib/blogData";

export default async function BlogIndexPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    // Temporarily show English posts only while other languages are being translated
    const posts = BLOG_POSTS_I18N['en'];

    if (!posts || posts.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">No posts found.</div>;
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            {/* Header Section */}
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-[#0F1E19] mb-6">
                    Homemade <span className="text-[#F47A44]">Journal</span>
                </h1>
                <p className="text-[#0F1E19]/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Insights, recipes, and success stories from our network of passionate home chefs and event caterers.
                </p>
            </section>

            {/* Featured Post (First item in array) */}
            <section className="max-w-7xl mx-auto px-6 mb-20">
                <Link href={`/${lang}/blog/${posts[0].slug}`} className="group relative rounded-3xl overflow-hidden shadow-2xl block h-[500px] w-full">
                    <Image
                        src={posts[0].image}
                        alt={posts[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E19] via-[#0F1E19]/40 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-4xl text-white">
                        <div className="flex gap-4 mb-4">
                            <span className="text-white/80 text-sm font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                {posts[0].readTime}
                            </span>
                        </div>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 leading-tight group-hover:text-orange-200 transition-colors">
                            {posts[0].title}
                        </h2>
                        <p className="text-white/80 text-lg line-clamp-2 md:line-clamp-none max-w-2xl">
                            {posts[0].excerpt}
                        </p>
                    </div>
                </Link>
            </section>

            {/* Grid of Remaining Posts */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <h3 className="font-heading text-3xl font-bold text-[#0F1E19] mb-12 border-b border-black/10 pb-4">Latest Articles</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.slice(1).map((post) => (
                        <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-black/5">
                            <div className="relative h-60 w-full overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-[#F47A44] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-medium">
                                    <span>{post.publishedAt}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h4 className="font-heading text-2xl font-bold text-[#0F1E19] mb-4 leading-snug group-hover:text-[#F47A44] transition-colors">
                                    {post.title}
                                </h4>
                                <p className="text-[#0F1E19]/70 line-clamp-3 mb-6 flex-grow">
                                    {post.excerpt}
                                </p>
                                <div className="text-[#F47A44] font-bold text-sm tracking-widest uppercase flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                                    Read Article
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
