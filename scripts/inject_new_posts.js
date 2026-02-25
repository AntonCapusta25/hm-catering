const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const tsFilePath = path.join(rootDir, 'src/lib/blogData.ts');

console.log(`Working Directory: ${rootDir}`);
console.log(`Targeting TS File: ${tsFilePath}`);

let tsContent = fs.readFileSync(tsFilePath, 'utf8');
const originalLength = tsContent.length;

// the keys match the TS array names, the values match the file prefixes
const localeToFileMap = {
    'nl': 'dutch',
    'en': 'english',
    'fr': 'french',
    'ar': 'arabic',
    'hi': 'hindi'
};

const locales = Object.keys(localeToFileMap);

let totalInjected = 0;

for (const locale of locales) {
    let allPostsForLocale = [];

    // The files are in the root directory, named by full language word
    const filePrefix = localeToFileMap[locale];
    // We are now only importing Batch 4
    const batch4Path = path.join(rootDir, `${filePrefix}_batch_5.json`);

    if (fs.existsSync(batch4Path)) {
        console.log(`[+] Found ${batch4Path}`);
        const batch4Data = JSON.parse(fs.readFileSync(batch4Path, 'utf8'));
        allPostsForLocale = allPostsForLocale.concat(batch4Data);
    } else {
        console.log(`[-] MISSING: ${batch4Path}`);
    }

    if (allPostsForLocale.length > 0) {
        console.log(`Injecting ${allPostsForLocale.length} posts for locale: ${locale}`);

        // Find the specific array start: '    nl: [' or '    en: ['
        const targetString = `\n    ${locale}: [\n`;
        const targetIndex = tsContent.indexOf(targetString);

        if (targetIndex !== -1) {
            const startIndex = targetIndex + targetString.length;

            let formattedPosts = '';
            for (const post of allPostsForLocale) {
                const category = post.category || 'Amsterdam Catering';
                const readTime = post.readTime || '5 min read';
                // Depending on locale, adjust publishedAt slightly
                let publishedAt = 'Feb 26, 2026';
                if (locale === 'nl') publishedAt = '26 Feb, 2026';
                if (locale === 'fr') publishedAt = '26 Fév, 2026';
                if (locale === 'ar') publishedAt = '26 فبراير 2026';
                if (locale === 'hi') publishedAt = '26 फरवरी 2026';

                // Construct the object string manually to ensure it's valid TS
                const title = JSON.stringify(post.title);
                const slug = JSON.stringify(post.slug);
                const cat = JSON.stringify(category);
                const rt = JSON.stringify(readTime);
                const pa = JSON.stringify(publishedAt);
                const ex = JSON.stringify(post.excerpt);
                const img = JSON.stringify(post.image);
                const authorName = JSON.stringify(post.author.name);
                const authorRole = JSON.stringify(post.author.role);
                // For HTML, use backticks and escape backticks and ${
                let html = post.contentHtml;
                if (!html) html = "";

                html = html.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\\$\\{/g, '\\\\${');

                formattedPosts += `        {
            title: ${title},
            slug: ${slug},
            category: ${cat},
            readTime: ${rt},
            publishedAt: ${pa},
            excerpt: ${ex},
            image: ${img},
            author: { name: ${authorName}, role: ${authorRole} },
            contentHtml: \`${html}\`
        },\n`;
            }

            tsContent = tsContent.slice(0, startIndex) + formattedPosts + tsContent.slice(startIndex);
            totalInjected += allPostsForLocale.length;
            console.log(`SUCCESS: Injected ${allPostsForLocale.length} posts for ${locale}`);
        } else {
            console.error(`ERROR: Could not find exact array match for locale: ${locale}. Looked for "${targetString}"`);
        }
    }
}

console.log(`Old length: ${originalLength}, New length: ${tsContent.length}`);

if (tsContent.length > originalLength) {
    fs.writeFileSync(tsFilePath, tsContent);
    console.log(`Injection complete. Added ${totalInjected} total posts. Saved successfully to blogData.ts`);
} else {
    console.log('CRITICAL: Script ran but file length did not change. Write aborted.');
}
