/**
 * translate-blogs-ollama.mjs
 *
 * Uses a local Ollama model (qwen2.5:3b) to translate blog post metadata
 * (title, excerpt, author name/role) across all 5 languages.
 * contentHtml stays in the source language (too long for LLM context).
 *
 * Run: node scripts/translate-blogs-ollama.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_FILE = join(__dirname, "../src/lib/blogData.ts");
const CACHE_FILE = join(__dirname, "../scripts/ollama-cache.json");
const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "qwen2.5:3b";

const LANG_NAMES = {
    nl: "Dutch",
    en: "English",
    fr: "French",
    ar: "Arabic",
    hi: "Hindi",
};

const LANGUAGES = ["nl", "en", "fr", "ar", "hi"];

// ---- cache ----
let cache = {};
if (existsSync(CACHE_FILE)) {
    try { cache = JSON.parse(readFileSync(CACHE_FILE, "utf8")); } catch { }
    console.log(`📦 Cache loaded: ${Object.keys(cache).length} entries`);
}
const saveCache = () => writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Ask the local LLM to translate text to a target language */
async function txLLM(text, targetLang, attempt = 0) {
    if (!text || text.trim().length < 2) return text;
    const key = `${targetLang}||${text}`;
    if (cache[key]) return cache[key];

    const langName = LANG_NAMES[targetLang] || targetLang;
    const prompt = `Translate the following text to ${langName}. Output ONLY the translation, no explanations, no quotes.\n\nText: ${text}`;

    try {
        const res = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL,
                prompt,
                stream: false,
                options: { temperature: 0.1, num_predict: 512 },
            }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const result = (data.response || "").trim();
        if (!result) throw new Error("Empty response");

        cache[key] = result;
        return result;
    } catch (e) {
        if (attempt < 3) {
            await sleep(1000);
            return txLLM(text, targetLang, attempt + 1);
        }
        console.error(`  ⚠️  LLM failed for "${text.slice(0, 40)}..." → ${targetLang}: ${e.message}`);
        return text;
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

function buildPost(p, slugOverride) {
    const slug = slugOverride || p.slug;
    const safeHtml = (p.contentHtml || "").replace(/`/g, "\\`").replace(/\${/g, "\\${");
    return `        {
            title: ${JSON.stringify(p.title)},
            slug: ${JSON.stringify(slug)},
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

async function checkOllama() {
    try {
        const res = await fetch("http://localhost:11434/api/tags");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const models = (data.models || []).map(m => m.name);
        console.log(`✅ Ollama running. Models available: ${models.join(", ") || "(none)"}`);
        if (!models.some(m => m.startsWith("qwen2.5:3b") || m.startsWith("qwen2.5"))) {
            console.error(`❌ Model "${MODEL}" not found. Run: ollama pull ${MODEL}`);
            process.exit(1);
        }
    } catch {
        console.error("❌ Ollama is not running. Start it with: ollama serve");
        process.exit(1);
    }
}

// ---- MAIN ----
(async () => {
    await checkOllama();

    console.log("\n📖 Reading blogData.ts...");
    const raw = readFileSync(BLOG_FILE, "utf8");

    const allPosts = {};
    for (const lang of LANGUAGES) {
        const sec = extractSection(raw, lang);
        if (!sec) { allPosts[lang] = []; continue; }
        allPosts[lang] = extractPosts(sec).map(parsePost);
        console.log(`   "${lang}": ${allPosts[lang].length} posts`);
    }

    const total = Object.values(allPosts).reduce((s, a) => s + a.length, 0);
    console.log(`\n📊 Total: ${total} posts → target: ${total} posts per language\n`);

    const newSections = {};

    for (const targetLang of LANGUAGES) {
        console.log(`\n🌐 ──── Building "${targetLang}" section ────`);
        const section = [];

        // Own posts first, no translation needed
        console.log(`   ✓ Own "${targetLang}" posts: ${allPosts[targetLang].length}`);
        for (const p of allPosts[targetLang]) section.push(buildPost(p));

        // Translate from each other language
        for (const sourceLang of LANGUAGES) {
            if (sourceLang === targetLang) continue;
            const posts = allPosts[sourceLang];
            console.log(`\n   → "${sourceLang}" → "${targetLang}": ${posts.length} posts`);

            for (let i = 0; i < posts.length; i++) {
                const p = posts[i];
                process.stdout.write(`      [${String(i + 1).padStart(2)}/${posts.length}] ${p.title.slice(0, 55)}\r`);

                // Translate metadata fields
                const [title, excerpt, authorName, authorRole] = await Promise.all([
                    txLLM(p.title, targetLang),
                    txLLM(p.excerpt, targetLang),
                    txLLM(p.authorName, targetLang),
                    txLLM(p.authorRole, targetLang),
                ]);

                const slug = `${sourceLang}-${p.slug}`;
                section.push(buildPost({ ...p, title, excerpt, authorName, authorRole }, slug));

                if ((i + 1) % 5 === 0) saveCache();
            }

            console.log(`\n      ✅ Done`);
        }

        newSections[targetLang] = section;
        saveCache();
        console.log(`\n   ✅ "${targetLang}" complete: ${section.length} posts`);
    }

    // ---- rebuild blogData.ts ----
    console.log("\n✍️  Rebuilding blogData.ts...");
    const firstPos = Math.min(
        ...LANGUAGES.map(l => { const p = raw.indexOf(`    "${l}": [`); return p === -1 ? Infinity : p; })
    );
    const header = raw.slice(0, firstPos);
    const body = LANGUAGES.map((lang, i) =>
        `    "${lang}": [\n${newSections[lang].join(",\n")}\n    ]${i < LANGUAGES.length - 1 ? "," : ""}`
    ).join("\n");

    writeFileSync(BLOG_FILE, header + body + "\n};\n", "utf8");
    saveCache();

    console.log("\n✅ All done! Stats:");
    LANGUAGES.forEach(l => console.log(`   "${l}": ${newSections[l].length} posts`));
})();
