const fs = require('fs');
const https = require('https');
const path = require('path');

const tsFilePath = path.join(__dirname, '../src/lib/blogData.ts');

async function testUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve({ url, status: res.statusCode });
            res.resume();
        }).on('error', (e) => {
            resolve({ url, status: 0 });
        });
    });
}

async function fixImages() {
    console.log("Reading blogData.ts...");
    let tsContent = fs.readFileSync(tsFilePath, 'utf8');

    // Extract all unique images
    const regex = /"https:\/\/images\.unsplash\.com\/[^"]+"/g;
    const urls = [...new Set(tsContent.match(regex))].map(s => s.slice(1, -1));

    console.log(`Found ${urls.length} unique URLs`);

    const results = [];
    for (const url of urls) {
        const res = await testUrl(url);
        results.push(res);
        console.log(`[${res.status}] ${url}`);
    }

    const workingUrls = results.filter(r => r.status === 200 || r.status === 302).map(r => r.url);
    const brokenUrls = results.filter(r => r.status === 404 || r.status === 403).map(r => r.url);

    console.log(`\nFound ${workingUrls.length} working URLs and ${brokenUrls.length} broken URLs.`);

    if (brokenUrls.length > 0 && workingUrls.length > 0) {
        let modified = 0;
        brokenUrls.forEach((brokenUrl, index) => {
            // Pick a working URL (cycle through them)
            const replacement = workingUrls[index % workingUrls.length];

            // Global replace in TS file
            const replaceRegex = new RegExp(brokenUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const matches = tsContent.match(replaceRegex);
            if (matches) {
                tsContent = tsContent.replace(replaceRegex, replacement);
                modified += matches.length;
            }
        });

        fs.writeFileSync(tsFilePath, tsContent);
        console.log(`\nReplaced ${modified} occurrences of broken images with working fallback images.`);
    } else {
        console.log('\nNo broken URLs found or no working fallback URLs available.');
    }
}

fixImages().catch(console.error);
