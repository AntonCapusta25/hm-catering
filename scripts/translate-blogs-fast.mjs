/**
 * translate-blogs-fast.mjs  (v3 — batch metadata only)
 *
 * Cross-language blog expansion:
 *  - Reads all 220 posts across 5 language sections
 *  - For each target language, adds ALL posts from other languages
 *  - ONLY translates: title, excerpt, author name/role (metadata)
 *  - contentHtml kept verbatim from source language (fast, no rate limits)
 *
 * Result: ~220 posts per language section in minutes.
 *
 * Run: node scripts/translate-blogs-fast.mjs
 */

import { translate } from "@vitalets/google-translate-api";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_FILE = join(__dirname, "../src/lib/blogData.ts");
const CACHE_FILE = join(__dirname, "../scripts/translate-cache.json");

const LANGUAGES = ["nl", "en", "fr", "ar", "hi"];
const BATCH_SIZE = 40; // strings per translate call

let cache = {};
if (existsSync(CACHE_FILE)) {
    try { cache = JSON.parse(readFileSync(CACHE_FILE, "utf8")); } catch { }
    console.log(`📦 Loaded ${Object.keys(cache).length} cached translations.`);
}
const saveCache = () => writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Batch translate an array of strings to a target language */
async function batchTx(strings, to, attempt = 0) {
    // Map through cache first
    const uncachedKeys = [];
    const results = strings.map((s, i) => {
        const key = `${to}||${s}`;
        if (cache[key]) return cache[key];
        uncachedKeys.push(i);
        return null;
    });

    if (uncachedKeys.length === 0) return results; // all cached

    const toTranslate = uncachedKeys.map((i) => strings[i]);
    try {
        const resp = await translate(toTranslate, { to });
        // resp.text can be array or string depending on input
        const translated = Array.isArray(resp.text) ? resp.text : [resp.text];
        uncachedKeys.forEach((origIdx, i) => {
            const key = `${to}||${strings[origIdx]}`;
            const val = translated[i] ?? strings[origIdx];
            cache[key] = val;
            results[origIdx] = val;
        });
        return results;
    } catch (e) {
        if (attempt < 4) {
            await sleep(2000 * (attempt + 1));
            return batchTx(strings, to, attempt + 1);
        }
        console.error(`  ⚠️  Batch translate failed (${to}): ${e.message.slice(0, 60)}`);
        return strings; // fallback to originals
    }
}

// ---- parser ----
function extractSection(raw, lang) {
    const marker = `    "${lang}": [`;
    const start = raw.indexOf(marker);
    if (start === -1) return null;
    let end = raw.length;
    for (const l of LANGUAGES) {
        if (l === lang) continue;
        const pos = raw.indexOf(`    "${l}": [`, start + marker.length);
        if (pos !== -1 && pos < end) end = pos;
    }
    const objEnd = raw.indexOf("\n};", start);
    if (objEnd !== -1 && objEnd < end) end = objEnd + 1;
    return raw.slice(start + marker.length, end);
}

function extractPosts(content) {
    const posts = [];
    let depth = 0, start = -1;
    let inTpl = false, inStr = false, sc = "", esc = false;
    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        if (esc) { esc = false; continue; }
        if (c === "\\") { esc = true; continue; }
        if (inTpl) { if (c === "`") inTpl = false; continue; }
        if (inStr) { if (c === sc) inStr = false; continue; }
        if (c === "`") { inTpl = true; continue; }
        if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
        if (c === "{") { if (depth === 0) start = i; depth++; }
        else if (c === "}") {
            depth--;
            if (depth === 0 && start !== -1) { posts.push(content.slice(start, i + 1)); start = -1; }
        }
    }
    return posts;
}

function ex(ps, re) { const m = ps.match(re); return m ? m[1] : ""; }
function parsePost(ps) {
    return {
        title: ex(ps, /title:\s*["']([^"']+)["']/),
        slug: ex(ps, /slug:\s*["']([^"']+)["']/),
        category: ex(ps, /category:\s*["']([^"']+)["']/),
        readTime: ex(ps, /readTime:\s*["']([^"']+)["']/),
        publishedAt: ex(ps, /publishedAt:\s*["']([^"']+)["']/),
        excerpt: ex(ps, /excerpt:\s*["']([^"']*?)["']/),
        image: ex(ps, /image:\s*["'`]([^"'`]+)["'`]/),
        authorName: (() => { const m = ps.match(/author:\s*\{[^}]*name:\s*["']([^"']+)["']/); return m ? m[1] : ""; })(),
        authorRole: (() => { const m = ps.match(/author:\s*\{[^}]*role:\s*["']([^"']+)["']/); return m ? m[1] : ""; })(),
        contentHtml: (() => { const m = ps.match(/contentHtml:\s*`([\s\S]*?)`\s*\n\s*\}/); return m ? m[1] : ""; })(),
    };
}

function buildPost(p, slug) {
    const safeHtml = p.contentHtml.replace(/`/g, "\\`").replace(/\${/g, "\\${");
    return `        {
            title: ${JSON.stringify(p.title)},
            slug: ${JSON.stringify(slug || p.slug)},
            category: ${JSON.stringify(p.category)},
            readTime: ${JSON.stringify(p.readTime)},
            publishedAt: ${JSON.stringify(p.publishedAt)},
            excerpt: ${JSON.stringify(p.excerpt)},
            image: ${JSON.stringify(p.image)},
            author: { name: ${JSON.stringify(p.authorName)}, role: ${JSON.stringify(p.authorRole)} },
            contentHtml: \`
${safeHtml}
\`
        }`;
}

// ---- MAIN ----
(async () => {
    console.log("📖 Reading blogData.ts...");
    const raw = readFileSync(BLOG_FILE, "utf8");

    // Parse all posts
    const allPosts = {};
    for (const lang of LANGUAGES) {
        const sec = extractSection(raw, lang);
        if (!sec) { allPosts[lang] = []; continue; }
        allPosts[lang] = extractPosts(sec).map(parsePost);
        console.log(`   "${lang}": ${allPosts[lang].length} posts`);
    }

    const total = Object.values(allPosts).reduce((s, a) => s + a.length, 0);
    console.log(`\n📊 Total: ${total} posts. Each language will have ${total} posts.\n`);

    const newSections = {};

    for (const targetLang of LANGUAGES) {
        console.log(`\n🌐 Building "${targetLang}" section...`);
        const section = [];

        // 1. Own posts — keep as-is
        console.log(`   ✓ Own posts: ${allPosts[targetLang].length}`);
        for (const p of allPosts[targetLang]) section.push(buildPost(p));

        // 2. Foreign posts — translate metadata, keep contentHtml
        for (const sourceLang of LANGUAGES) {
            if (sourceLang === targetLang) continue;
            const posts = allPosts[sourceLang];
            console.log(`   → "${sourceLang}" → "${targetLang}": ${posts.length} posts (metadata only)`);

            // Batch translate all titles at once
            const titles = await batchTx(posts.map(p => p.title), targetLang);
            await sleep(300);
            const excerpts = await batchTx(posts.map(p => p.excerpt), targetLang);
            await sleep(300);
            const aNames = await batchTx(posts.map(p => p.authorName), targetLang);
            await sleep(200);
            const aRoles = await batchTx(posts.map(p => p.authorRole), targetLang);
            await sleep(300);

            posts.forEach((p, i) => {
                const translated = {
                    ...p,
                    title: titles[i] || p.title,
                    excerpt: excerpts[i] || p.excerpt,
                    authorName: aNames[i] || p.authorName,
                    authorRole: aRoles[i] || p.authorRole,
                    // contentHtml stays in source language — no rate-limit issues
                };
                const slug = `${sourceLang}-${p.slug}`; // prefix to avoid slug collisions
                section.push(buildPost(translated, slug));
            });
        }

        newSections[targetLang] = section;
        saveCache();
        console.log(`   ✅ "${targetLang}": ${section.length} total posts`);
    }

    // ---- Rebuild blogData.ts ----
    console.log("\n✍️  Rebuilding blogData.ts...");
    const firstPos = Math.min(
        ...LANGUAGES.map(l => { const p = raw.indexOf(`    "${l}": [`); return p === -1 ? Infinity : p; })
    );
    const header = raw.slice(0, firstPos);

    const body = LANGUAGES.map((lang, i) => {
        const comma = i < LANGUAGES.length - 1 ? "," : "";
        return `    "${lang}": [\n${newSections[lang].join(",\n")}\n    ]${comma}`;
    }).join("\n");

    writeFileSync(BLOG_FILE, header + body + "\n};\n", "utf8");
    saveCache();

    console.log("\n✅ Done! Final stats:");
    LANGUAGES.forEach(l => console.log(`   "${l}": ${newSections[l].length} posts`));
})();
