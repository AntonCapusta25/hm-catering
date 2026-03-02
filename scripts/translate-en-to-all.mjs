/**
 * translate-en-to-all.mjs
 *
 * THE CORRECT ARCHITECTURE:
 * - Takes all 44 English blog posts (source of truth)
 * - Translates them FULLY (title + excerpt + author + contentHtml) to NL, FR, AR, HI
 * - Keeps the EXACT SAME SLUGS as English in every language section
 * - Overwrites nl/fr/ar/hi sections in blogData.ts
 *
 * Result: switching /en/blog/slug → /nl/blog/slug works perfectly.
 *
 * Uses local Ollama (qwen2.5:3b), disk-based cache — safe to interrupt & resume.
 * Run: node scripts/translate-en-to-all.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_FILE = join(__dirname, "../src/lib/blogData.ts");
const CACHE_FILE = join(__dirname, "../scripts/en-to-all-cache.json");
const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "qwen2.5:3b";
const CHUNK_SIZE = 2500; // chars per HTML chunk

const TARGET_LANGS = ["nl", "fr", "ar", "hi"];
const LANG_NAMES = { nl: "Dutch", fr: "French", ar: "Arabic", hi: "Hindi" };
const ALL_LANGS = ["nl", "en", "fr", "ar", "hi"];

// ─── cache ───────────────────────────────────────────────────────────────────
let cache = {};
if (existsSync(CACHE_FILE)) {
    try { cache = JSON.parse(readFileSync(CACHE_FILE, "utf8")); } catch { }
    console.log(`📦 Cache: ${Object.keys(cache).length} entries`);
}
const saveCache = () => writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Ollama translation ───────────────────────────────────────────────────────
async function tx(text, toLang, isHtml = false, attempt = 0) {
    if (!text || text.trim().length < 3) return text;
    const key = `${toLang}|${isHtml ? "html" : "txt"}|${text}`;
    if (cache[key]) return cache[key];

    const langName = LANG_NAMES[toLang];
    const prompt = isHtml
        ? `Translate the following HTML to ${langName}. 
RULES:
- Keep ALL HTML tags, attributes, classes EXACTLY as-is
- Only translate visible text between tags
- Do NOT wrap in markdown, do NOT explain, output ONLY the translated HTML

HTML:
${text}`
        : `Translate to ${langName}. Output ONLY the translation, nothing else.

Text: ${text}`;

    try {
        const res = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL,
                prompt,
                stream: false,
                options: { temperature: 0.1, num_predict: Math.max(256, Math.ceil(text.length * 1.3)), num_ctx: 4096 },
            }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let out = (data.response || "").trim().replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
        if (!out) throw new Error("empty");
        cache[key] = out;
        return out;
    } catch (e) {
        if (attempt < 3) { await sleep(1200); return tx(text, toLang, isHtml, attempt + 1); }
        return text; // fallback to original
    }
}

async function translateHtml(html, toLang) {
    if (!html || html.trim().length < 10) return html;
    const lines = html.split("\n");
    const chunks = [];
    let cur = "";
    for (const line of lines) {
        if (cur.length + line.length + 1 > CHUNK_SIZE && cur.trim()) { chunks.push(cur); cur = line; }
        else cur += (cur ? "\n" : "") + line;
    }
    if (cur.trim()) chunks.push(cur);

    const results = [];
    for (const chunk of chunks) {
        const hasTranslatableText = />[^<]{3,}<|[\u0600-\u06FF\u0900-\u097F\u00C0-\u024F\u4E00-\u9FFF]/.test(chunk);
        if (!hasTranslatableText) { results.push(chunk); continue; }
        results.push(await tx(chunk, toLang, true));
        await sleep(80);
    }
    return results.join("\n");
}

// ─── parser ──────────────────────────────────────────────────────────────────
function extractSection(raw, lang) {
    const marker = `    "${lang}": [`;
    const start = raw.indexOf(marker);
    if (start === -1) return { text: null, sectionStart: -1, sectionEnd: -1 };
    let end = raw.length;
    for (const l of ALL_LANGS) {
        if (l === lang) continue;
        const p = raw.indexOf(`    "${l}": [`, start + marker.length);
        if (p !== -1 && p < end) end = p;
    }
    const objEnd = raw.indexOf("\n};", start);
    if (objEnd !== -1 && objEnd < end) end = objEnd + 1;
    return { text: raw.slice(start + marker.length, end), sectionStart: start + marker.length, sectionEnd: end };
}

function extractPosts(content) {
    const posts = [];
    let depth = 0, start = -1, inTpl = false, inStr = false, sc = "", esc = false;
    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        if (esc) { esc = false; continue; } if (c === "\\") { esc = true; continue; }
        if (inTpl) { if (c === "`") inTpl = false; continue; }
        if (inStr) { if (c === sc) inStr = false; continue; }
        if (c === "`") { inTpl = true; continue; } if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
        if (c === "{") { if (depth === 0) start = i; depth++; }
        else if (c === "}") { depth--; if (depth === 0 && start !== -1) { posts.push(content.slice(start, i + 1)); start = -1; } }
    }
    return posts;
}

function ex(s, re) { const m = s.match(re); return m ? m[1] : ""; }
function parsePost(ps) {
    return {
        title: ex(ps, /title:\s*["']([^"']+)["']/),
        slug: ex(ps, /slug:\s*["']([^"']+)["']/),
        category: ex(ps, /category:\s*["']([^"']+)["']/),
        readTime: ex(ps, /readTime:\s*["']([^"']+)["']/),
        publishedAt: ex(ps, /publishedAt:\s*["']([^"']+)["']/),
        excerpt: ex(ps, /excerpt:\s*["']([^"']*?)["']/),
        image: ex(ps, /image:\s*["'`]([^"'`]+)["'`]/),
        authorName: (() => { const m = ps.match(/author:\s*\{[^}]*name:\s*["']([^"']+)["']/); return m?.[1] ?? ""; })(),
        authorRole: (() => { const m = ps.match(/author:\s*\{[^}]*role:\s*["']([^"']+)["']/); return m?.[1] ?? ""; })(),
        contentHtml: (() => { const m = ps.match(/contentHtml:\s*`([\s\S]*?)`\s*\n\s*\}/); return m?.[1] ?? ""; })(),
    };
}

function buildPost(p) {
    const safe = (p.contentHtml || "").replace(/`/g, "\\`").replace(/\${/g, "\\${");
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
${safe}
\`
        }`;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
(async () => {
    // Check Ollama
    try {
        const r = await fetch("http://localhost:11434/api/tags");
        const d = await r.json();
        const ms = (d.models || []).map(m => m.name);
        console.log(`✅ Ollama: ${ms.join(", ")}`);
        if (!ms.some(m => m.startsWith("qwen2.5"))) throw new Error(`${MODEL} not found`);
    } catch (e) { console.error("❌ Ollama error:", e.message); process.exit(1); }

    console.log("\n📖 Reading blogData.ts...");
    let raw = readFileSync(BLOG_FILE, "utf8");

    // Extract EN posts (source of truth)
    const { text: enText } = extractSection(raw, "en");
    const enPosts = extractPosts(enText).map(parsePost);
    console.log(`   EN posts: ${enPosts.length}`);

    // Translate to each target language
    for (const targetLang of TARGET_LANGS) {
        const langName = LANG_NAMES[targetLang];
        console.log(`\n🌐 Translating EN → ${langName} (${targetLang})...`);

        const translatedPosts = [];

        for (let i = 0; i < enPosts.length; i++) {
            const p = enPosts[i];
            process.stdout.write(`   [${String(i + 1).padStart(2)}/${enPosts.length}] ${p.title.slice(0, 50)}...\r`);

            const [title, excerpt, authorName, authorRole] = await Promise.all([
                tx(p.title, targetLang),
                tx(p.excerpt, targetLang),
                tx(p.authorName, targetLang),
                tx(p.authorRole, targetLang),
            ]);
            await sleep(100);

            const contentHtml = await translateHtml(p.contentHtml, targetLang);

            translatedPosts.push(buildPost({
                ...p,
                title, excerpt, authorName, authorRole, contentHtml,
                // SAME slug as English — this is the key!
            }));

            // Save progress every 3 posts
            if ((i + 1) % 3 === 0) {
                saveCache();
                // Intermediate write for this language (in case of crash)
                const partialSection = `    "${targetLang}": [\n${translatedPosts.join(",\n")}\n    ]`;
                process.stdout.write(`\n   💾 Progress saved (${i + 1}/${enPosts.length})\n`);
            }
        }

        // Replace the target language section in the file
        console.log(`\n   ✅ ${langName} done (${translatedPosts.length} posts). Updating blogData.ts...`);
        // Re-read raw each time in case of concurrent updates
        raw = readFileSync(BLOG_FILE, "utf8");
        const { sectionStart, sectionEnd } = extractSection(raw, targetLang);
        const newSection = translatedPosts.join(",\n") + "\n    ";
        raw = raw.slice(0, sectionStart) + newSection + raw.slice(sectionEnd);
        writeFileSync(BLOG_FILE, raw, "utf8");
        saveCache();
    }

    console.log("\n✅ All done! Every language now has the same 44 EN slugs, fully translated.");
})();
