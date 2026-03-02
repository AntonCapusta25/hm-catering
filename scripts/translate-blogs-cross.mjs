/**
 * translate-blogs-cross.mjs  (v2 — fast bulk-HTML translation)
 *
 * Translates all 220 blog posts across 5 languages (nl/en/fr/ar/hi),
 * so each language section ends up with ALL 220 posts.
 *
 * Speed: translates contentHtml in 4000-char chunks → ~50× faster than
 * per-text-node approach.
 *
 * Run: node scripts/translate-blogs-cross.mjs
 */

import { translate } from "@vitalets/google-translate-api";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_FILE = join(__dirname, "../src/lib/blogData.ts");
const CACHE_FILE = join(__dirname, "../scripts/translate-cache.json");

const LANGUAGES = ["nl", "en", "fr", "ar", "hi"];
const CHUNK_SIZE = 3800; // chars per translate call (safe under 5000 limit)

// ---- cache ----
let cache = {};
if (existsSync(CACHE_FILE)) {
    try { cache = JSON.parse(readFileSync(CACHE_FILE, "utf8")); } catch { }
    console.log(`📦 Loaded ${Object.keys(cache).length} cached translations.`);
} else {
    console.log("📦 No cache — starting fresh.");
}
const saveCache = () => writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tx(text, to, attempt = 0) {
    if (!text || text.trim().length < 2) return text;
    const key = `${to}||${text}`;
    if (cache[key]) return cache[key];
    try {
        const { text: out } = await translate(text, { to });
        cache[key] = out;
        return out;
    } catch (e) {
        if (attempt < 5) {
            await sleep(1500 * (attempt + 1));
            return tx(text, to, attempt + 1);
        }
        return text; // give up, return original
    }
}

/**
 * Translate HTML by splitting into chunks ≤ CHUNK_SIZE chars,
 * each translated as a full HTML block. Google Translate preserves
 * HTML tags when the input contains them.
 */
async function translateHtmlBulk(html, to) {
    if (!html || html.trim().length < 5) return html;

    // Split at blank lines so we don't break mid-tag
    const lines = html.split("\n");
    const chunks = [];
    let current = "";
    for (const line of lines) {
        if (current.length + line.length + 1 > CHUNK_SIZE && current.length > 0) {
            chunks.push(current);
            current = line;
        } else {
            current += (current ? "\n" : "") + line;
        }
    }
    if (current) chunks.push(current);

    const translated = [];
    for (const chunk of chunks) {
        const out = await tx(chunk, to);
        translated.push(out);
        await sleep(120);
    }
    return translated.join("\n");
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

function buildPost(p) {
    // Escape backticks in contentHtml so they don't break the template literal
    const safeHtml = p.contentHtml.replace(/`/g, "\\`").replace(/\${/g, "\\${");
    return `        {
            title: ${JSON.stringify(p.title)},
            slug: ${JSON.stringify(p.slug)},
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

async function translatePost(p, sourceLang, targetLang) {
    const [title, excerpt, authorName, authorRole, contentHtml] = await Promise.all([
        tx(p.title, targetLang).then(async (r) => { await sleep(80); return r; }),
        tx(p.excerpt, targetLang).then(async (r) => { await sleep(80); return r; }),
        tx(p.authorName, targetLang).then(async (r) => { await sleep(40); return r; }),
        tx(p.authorRole, targetLang).then(async (r) => { await sleep(40); return r; }),
        translateHtmlBulk(p.contentHtml, targetLang),
    ]);

    // Slug: prefix with source lang to avoid collisions, keep original base
    const slug = `${sourceLang}-${p.slug}`;

    return { ...p, title, slug, excerpt, authorName, authorRole, contentHtml };
}

// ---- MAIN ----
(async () => {
    console.log("📖 Reading blogData.ts...");
    const raw = readFileSync(BLOG_FILE, "utf8");

    // Parse all posts by language
    const allPosts = {};
    for (const lang of LANGUAGES) {
        const sec = extractSection(raw, lang);
        if (!sec) { allPosts[lang] = []; continue; }
        const strs = extractPosts(sec);
        allPosts[lang] = strs.map(parsePost);
        console.log(`   "${lang}": ${allPosts[lang].length} posts parsed`);
    }

    const total = Object.values(allPosts).reduce((s, a) => s + a.length, 0);
    console.log(`\n📊 Total: ${total} posts across all languages`);
    console.log(`   Each language section will have: ${total} posts\n`);

    // Build each target language section
    const newSections = {};

    for (const targetLang of LANGUAGES) {
        console.log(`\n🌐 ─── Building "${targetLang}" section ───`);
        const posts = [];

        for (const sourceLang of LANGUAGES) {
            const sourcePosts = allPosts[sourceLang];
            if (sourceLang === targetLang) {
                console.log(`   ✓ "${sourceLang}" (own) — ${sourcePosts.length} posts kept as-is`);
                for (const p of sourcePosts) posts.push(buildPost(p));
                continue;
            }

            console.log(`   → "${sourceLang}" → "${targetLang}": ${sourcePosts.length} posts...`);
            for (let i = 0; i < sourcePosts.length; i++) {
                const p = sourcePosts[i];
                process.stdout.write(`      [${String(i + 1).padStart(2)}/${sourcePosts.length}] ${p.title.slice(0, 55)}...\r`);
                const translated = await translatePost(p, sourceLang, targetLang);
                posts.push(buildPost(translated));
                if (i % 10 === 9) saveCache();
            }
            console.log(`\n      ✅ Done (${sourcePosts.length} posts)`);
        }

        newSections[targetLang] = posts;
        saveCache();
        console.log(`   ✅ "${targetLang}" complete: ${posts.length} total posts`);
    }

    // ---- Rebuild blogData.ts ----
    console.log("\n✍️  Rebuilding blogData.ts...");

    // Find header (everything before first language section)
    const firstPos = Math.min(
        ...LANGUAGES.map((l) => { const p = raw.indexOf(`    "${l}": [`); return p === -1 ? Infinity : p; })
    );
    const header = raw.slice(0, firstPos);

    const body = LANGUAGES.map((lang, i) => {
        const comma = i < LANGUAGES.length - 1 ? "," : "";
        return `    "${lang}": [\n${newSections[lang].join(",\n")}\n    ]${comma}`;
    }).join("\n");

    writeFileSync(BLOG_FILE, header + body + "\n};\n", "utf8");
    saveCache();

    console.log("\n✅ Done! Final stats:");
    LANGUAGES.forEach((l) => console.log(`   "${l}": ${newSections[l].length} posts`));
})();
