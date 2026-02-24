import { MetadataRoute } from 'next'
import { locales, Locale } from '@/i18n/config'
import { BLOG_POSTS_I18N, BlogPost } from '@/lib/blogData'

// Helper to get the canonical URL for a specific language
function getUrl(lang: string, path: string = '') {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://homemade-catering.com'
    return `${baseUrl}/${lang}${path ? `/${path}` : ''}`
}

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = []

    // Define our static routes
    const staticRoutes = [
        '',
        'catering',
        'thuiskok-amsterdam',
        'thuiskok-rotterdam',
        'zakelijke-catering-amsterdam',
        'faq',
        'menus/all',
        'about-us',
        'blog',
        'contact',
        // We also generated many other city pages, let's add a few top ones
        'thuiskok-den-haag',
        'thuiskok-utrecht',
        'thuiskok-haarlem',
        'thuiskok-leiden'
    ]

    // Add static routes and their alternates
    staticRoutes.forEach((route) => {
        // Generate alternate links for each language
        const alternates: Record<string, string> = {}
        locales.forEach((locale: Locale) => {
            alternates[locale] = getUrl(locale, route)
        })

        // Add entry for each language
        locales.forEach((locale: Locale) => {
            sitemapEntries.push({
                url: getUrl(locale, route),
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8,
                alternates: {
                    languages: alternates
                }
            })
        })
    })

    // Add Dynamic Blog Posts
    // We iterate through all blog posts in all languages
    Object.entries(BLOG_POSTS_I18N).forEach(([localeStr, posts]) => {
        const locale = localeStr as Locale;

        // Skip if somehow the locale in blogData isn't supported by the router
        if (!locales.includes(locale)) return

        (posts as BlogPost[]).forEach((post: BlogPost) => {

            sitemapEntries.push({
                url: getUrl(locale, `blog/${post.slug}`),
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6
            })
        })
    })

    return sitemapEntries
}
