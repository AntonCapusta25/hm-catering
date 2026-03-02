const https = require('https');
const fs = require('fs');
const path = require('path');

const tsFilePath = path.join(__dirname, '../src/lib/blogData.ts');

async function fetchUnsplashPage(query, page) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'unsplash.com',
            path: `/napi/search/photos?query=${query}&per_page=30&page=${page}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        };
        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({});
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    const images = new Set();
    const queries = ['gourmet%20food', 'fine%20dining%20plating', 'catering%20food', 'chef%20cooking', 'luxurious%20meal'];

    console.log("Fetching images from Unsplash API...");
    for (const q of queries) {
        for (let page = 1; page <= 3; page++) {
            const data = await fetchUnsplashPage(q, page);
            if (data && data.results) {
                data.results.forEach(item => {
                    // Use regular size which is max 1080px wide
                    if (item.urls && item.urls.regular) {
                        images.add(item.urls.regular);
                    }
                });
            }
            if (images.size >= 250) break;
        }
        if (images.size >= 250) break;
    }

    const imageUrls = Array.from(images);
    console.log(`Successfully harvested ${imageUrls.length} distinct Unsplash URLs.`);

    if (imageUrls.length < 220) {
        console.error("Failed to gather enough images.");
        return;
    }

    console.log("Reading blogData.ts...");
    let tsContent = fs.readFileSync(tsFilePath, 'utf8');

    let imageIndex = 0;

    // Replace all loremflickr URLs with unique Unsplash URLs
    tsContent = tsContent.replace(/image:\s*"https:\/\/loremflickr\.com\/[^"]+"/g, () => {
        const replaceUrl = imageUrls[imageIndex % imageUrls.length];
        imageIndex++;
        return `image: "${replaceUrl}"`;
    });

    console.log(`Replaced ${imageIndex} loremflickr images with Unsplash images.`);
    fs.writeFileSync(tsFilePath, tsContent, 'utf8');

    // Also, let's dump the first post's HTML to debug the accordion issue
    const firstHtmlMatch = tsContent.match(/contentHtml:\s*`([\s\S]*?)`/);
    if (firstHtmlMatch) {
        fs.writeFileSync('debug_post.html', firstHtmlMatch[1]);
        console.log("Dumped first post HTML to debug_post.html to inspect Accordion tags.");
    }
}

run();
