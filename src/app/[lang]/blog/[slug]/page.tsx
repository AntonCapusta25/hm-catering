import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkBtn } from "./CopyLinkBtn";
import { BLOG_POSTS_I18N } from "@/lib/blogData";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
    const { lang, slug } = await params;
    const posts = BLOG_POSTS_I18N[lang] || BLOG_POSTS_I18N['en'];
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Post Not Found | Homemade Catering",
        };
    }

    return {
        title: `${post.title} | Homemade Catering`,
        description: post.excerpt,
        openGraph: {
            images: [post.image],
        }
    };
}

export default async function BlogPostTemplate({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { lang, slug } = await params;
    const posts = BLOG_POSTS_I18N[lang] || BLOG_POSTS_I18N['en'];

    const post = posts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[#0F1E19]">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover scale-105"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E19] via-[#0F1E19]/60 to-transparent opacity-90"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 w-full pt-32">
                    <Link
                        className="inline-flex items-center gap-2 text-white/80 hover:text-[#F47A44] transition-colors mb-8 font-medium backdrop-blur-md bg-white/10 px-5 py-2 rounded-full border border-white/10"
                        href={`/${lang}/blog`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                            <path d="m12 19-7-7 7-7"></path>
                            <path d="M19 12H5"></path>
                        </svg>
                        Back to Blog
                    </Link>
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-bold tracking-wider uppercase text-[#F47A44]">
                            <span className="bg-[#F47A44]/20 backdrop-blur-sm px-4 py-1.5 rounded-lg border border-[#F47A44]/30">{post.category}</span>
                            <span className="text-white/60">•</span>
                            <span className="text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                                    <path d="M12 6v6l4 2"></path>
                                    <circle cx="12" cy="12" r="10"></circle>
                                </svg>
                                {post.readTime}
                            </span>
                        </div>
                        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-xl">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 text-white/90 border-t border-white/20 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#F47A44] bg-[#F47A44]/10 flex justify-center items-center font-bold text-[#F47A44]">
                                    {post.author.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-lg leading-none">{post.author.name}</p>
                                    <p className="text-white/60 text-sm">{post.author.role}</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-white/20 mx-2"></div>
                            <div className="flex flex-col">
                                <span className="text-white/60 text-xs uppercase tracking-widest">Published</span>
                                <span className="font-medium text-lg">{post.publishedAt}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content & Sidebar */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 py-20">

                {/* Social Share Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="flex flex-col gap-4 sticky top-32">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F47A44]/10 text-[#F47A44] mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                            </svg>
                        </div>
                        <a target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2]/20 transition-colors shadow-sm" aria-label="Visit us on Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=https://homemadechefs.com/blog/${slug}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-black hover:border-black/20 transition-colors shadow-sm" aria-label="Visit us on X (Twitter)" href={`https://twitter.com/intent/tweet?url=https://homemadechefs.com/blog/${slug}&text=${post.title}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                        </a>
                        <CopyLinkBtn slug={slug} />
                    </div>
                </aside>

                {/* Article Body */}
                <article className="lg:col-span-8">
                    <div
                        className="prose prose-xl prose-stone max-w-none prose-headings:font-heading prose-headings:text-[#0F1E19] prose-headings:font-bold prose-p:text-[#0F1E19]/80 prose-p:leading-loose prose-a:text-[#F47A44] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-[#F47A44] prose-blockquote:bg-[#F47A44]/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-img:rounded-2xl prose-img:shadow-xl first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:text-[#F47A44] first-letter:mr-3 first-letter:float-left"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                    />

                    {/* Author Box Block */}
                    <div className="bg-[#E6DCC3]/20 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 mt-16 border border-[#E6DCC3]/50">
                        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center bg-[#F47A44]/10 rounded-full border-2 border-white shadow-md">
                            <span className="text-4xl font-heading font-bold text-[#F47A44]">{post.author.name.charAt(0)}</span>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="text-[#F47A44] font-bold text-xs uppercase tracking-wider mb-1 block">Written By</span>
                            <h4 className="font-heading text-xl font-bold text-[#0F1E19]">{post.author.name}</h4>
                            <p className="text-[#0F1E19]/60 text-sm mt-1">{post.author.role}</p>
                            <p className="text-[#0F1E19]/70 text-sm mt-3 leading-relaxed">
                                Passionate about sharing insights on culinary trends and kitchen management. Bringing you the latest updates from the heart of the industry.
                            </p>
                        </div>
                    </div>
                </article>

                {/* Related Articles Array */}
                <div className="lg:col-span-3">
                    <div className="sticky top-32">
                        <h3 className="font-heading text-2xl font-bold text-[#0F1E19] mb-6 border-b border-[#0F1E19]/10 pb-4">Recent Articles</h3>
                        <div className="flex flex-col gap-8">
                            {posts.filter(p => p.slug !== slug).slice(0, 3).map((relatedPost) => (
                                <Link key={relatedPost.slug} href={`/${lang}/blog/${relatedPost.slug}`} className="group block">
                                    <div className="relative h-40 mb-4 overflow-hidden rounded-xl bg-gray-100">
                                        <Image
                                            src={relatedPost.image}
                                            alt={relatedPost.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <span className="text-[#F47A44] text-xs font-bold uppercase tracking-wider">{relatedPost.category}</span>
                                    <h4 className="font-heading text-lg font-bold text-[#0F1E19] mt-2 group-hover:text-[#F47A44] transition-colors leading-snug">
                                        {relatedPost.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <BookingForm />

            <Footer />
        </main>
    );
}
