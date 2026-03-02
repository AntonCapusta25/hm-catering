/**
 * translate-en-full.mjs
 *
 * Translates the FULL contentHtml of all foreign-origin posts in the "en"
 * section of blogData.ts into English using the local Ollama LLM.
 *
 * Only posts with slugs prefixed "nl-", "fr-", "ar-", "hi-" are processed
 * (these were cross-translated with metadata-only in the previous script).
 * Own English posts (no prefix) are skipped.
 *
 * Chunking: contentHtml split at blank lines into ~3000 char chunks.
 * Each chunk sent to Ollama separately and reassembled.
 * Disk cache means safe to re-run if interrupted.
 *
 * Run: node scripts/translate-en-full.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_FILE = join(__dirname, "../src/lib/blogData.ts");
const CACHE_FILE = join(__dirname, "../scripts/ollama-html-cache.json");
const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "qwen2.5:3b";
const CHUNK_SIZE = 3000; // chars per translation chunk

let cache = {};
if (existsSync(CACHE_FILE)) {
    try { cache = JSON.parse(readFileSync(CACHE_FILE, "utf8")); } catch { }
    console.log(`📦 HTML cache: ${Object.keys(cache).length} entries`);
}
const saveCache = () => writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function txChunk(html, attempt = 0) {
    const key = `en||${html}`;
    if (cache[key]) return cache[key];

    const prompt = `Translate the following HTML content to English. 
Rules:
- Preserve ALL HTML tags exactly as-is (do not modify any tag names, attributes, classes, or structure)
- Only translate the visible text content between tags
- Do NOT add explanations, notes, or markdown formatting
- Output ONLY the translated HTML

HTML to translate:
${html}`;

    try {
        const res = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL,
                prompt,
                stream: false,
                options: {
                    temperature: 0.1,
                    num_predict: Math.ceil(html.length * 1.5), // allow for expansion
                    num_ctx: 8192,
                },
            }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let result = (data.response || "").trim();
        // Strip any markdown code fences the model might add
        result = result.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
        if (!result) throw new Error("Empty response");
        cache[key] = result;
        return result;
    } catch (e) {
        if (attempt < 3) {
            await sleep(1500);
            return txChunk(html, attempt + 1);
        }
        console.error(`  ⚠️  chunk failed: ${e.message.slice(0, 60)}`);
        return html; // return original on failure
    }
}

async function translateHtml(html) {
    if (!html || html.trim().length < 10) return html;

    // Split into chunks at blank lines (natural breaks between HTML blocks)
    const lines = html.split("\n");
    const chunks = [];
    let current = "";

    for (const line of lines) {
        if (current.length + line.length + 1 > CHUNK_SIZE && current.trim()) {
            chunks.push(current);
            current = line;
        } else {
            current += (current ? "\n" : "") + line;
        }
    }
    if (current.trim()) chunks.push(current);

    const translated = [];
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        // Skip chunks that are pure HTML (no visible text worth translating)
        const hasText = />[^<]{4,}</.test(chunk) || /[\u0600-\u06FF\u0D00-\u0D7F\u0900-\u097F\u00C0-\u024F]/.test(chunk);
        if (!hasText) {
            translated.push(chunk);
            continue;
        }
        translated.push(await txChunk(chunk));
        await sleep(100);
    }
    return translated.join("\n");
}

// ---- parser (same as in translate-blogs-ollama.mjs) ----
const LANGUAGES = ["nl", "en", "fr", "ar", "hi"];

function extractSection(raw, lang) {
    const marker = `    "${lang}": [`;
    const start = raw.indexOf(marker);
    if (start === -1) return { text: null, start: -1, end: -1 };
    let end = raw.length;
    for (const l of LANGUAGES) {
        if (l === lang) continue;
        const pos = raw.indexOf(`    "${l}": [`, start + marker.length);
        if (pos !== -1 && pos < end) end = pos;
    }
    const objEnd = raw.indexOf("\n};", start);
    if (objEnd !== -1 && objEnd < end) end = objEnd + 1;
    return { text: raw.slice(start + marker.length, end), start: start + marker.length, end };
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
            if (depth === 0 && start !== -1) {
                posts.push({ str: content.slice(start, i + 1), rawStart: start, rawEnd: i + 1 });
                start = -1;
            }
        }
    }
    return posts;
}

function ex(ps, re) { const m = ps.match(re); return m ? m[1] : ""; }
function extractSlug(ps) { return ex(ps, /slug:\s*["']([^"']+)["']/); }
function extractContentHtml(ps) {
    const m = ps.match(/contentHtml:\s*`([\s\S]*?)`\s*\n\s*\}/);
    return m ? m[1] : null;
}

function replaceContentHtml(postStr, newHtml) {
    const safeHtml = newHtml.replace(/`/g, "\\`").replace(/\${/g, "\\${");
    return postStr.replace(
        /(contentHtml:\s*`)([\s\S]*?)(`\s*\n\s*\})/,
        (_, open, _old, close) => `${open}\n${safeHtml}\n${close}`
    );
}

// ---- MAIN ----
(async () => {
    // Verify Ollama
    try {
        const r = await fetch("http://localhost:11434/api/tags");
        const d = await r.json();
        const models = (d.models || []).map(m => m.name);
        console.log(`✅ Ollama: ${models.join(", ")}`);
    } catch {
        console.error("❌ Ollama not running. Start with: ollama serve");
        process.exit(1);
    }

    console.log("\n📖 Reading blogData.ts...");
    let raw = readFileSync(BLOG_FILE, "utf8");

    const { text: enContent, start: enStart, end: enEnd } = extractSection(raw, "en");
    if (!enContent) { console.error("❌ No 'en' section found"); process.exit(1); }

    const posts = extractPosts(enContent);
    console.log(`   Found ${posts.length} posts in "en" section`);

    // Only process foreign-origin posts (slug starts with "nl-", "fr-", "ar-", "hi-")
    const foreign = posts.filter(p => /^(nl|fr|ar|hi)-/.test(extractSlug(p.str)));
    const own = posts.filter(p => !/^(nl|fr|ar|hi)-/.test(extractSlug(p.str)));
    console.log(`   Own EN posts: ${own.length} (skip)`);
    console.log(`   Foreign-origin posts to fully translate: ${foreign.length}`);

    let processed = 0;
    let newEnContent = enContent;

    for (const post of foreign) {
        const slug = extractSlug(post.str);
        const contentHtml = extractContentHtml(post.str);
        if (!contentHtml) { console.log(`   ⚠️  No contentHtml for ${slug}`); continue; }

        // Check if already English (heuristic: no non-latin script chars)
        const hasNonEnglish = /[\u0600-\u06FF\u0D00-\u0D7F\u0900-\u097F\u00C0-\u024F\u4E00-\u9FFF]/.test(contentHtml);
        // Also check for Dutch/French/German words that signal non-English content
        const hasForeignWords = /\b(het|een|van|voor|zijn|ook|worden|bij|naar|maar|als|dan|hoe|wat|welke)\b/i.test(contentHtml) ||
            /\b(les|des|une|pour|avec|dans|par|sur|qui|que|est|son|tout|même)\b/i.test(contentHtml);

        if (!hasNonEnglish && !hasForeignWords) {
            console.log(`   ⏭  [${++processed}/${foreign.length}] ${slug.slice(0, 50)} — already English, skipping`);
            continue;
        }

        process.stdout.write(`   🔄 [${++processed}/${foreign.length}] ${slug.slice(0, 55)}...\r`);

        const translatedHtml = await translateHtml(contentHtml);
        const updatedPostStr = replaceContentHtml(post.str, translatedHtml);

        // Replace in the en section content
        newEnContent = newEnContent.slice(0, post.rawStart) + updatedPostStr + newEnContent.slice(post.rawEnd);

        // Update offsets for subsequent posts (length might have changed)
        const delta = updatedPostStr.length - post.str.length;
        for (const otherPost of foreign) {
            if (otherPost.rawStart > post.rawStart) {
                otherPost.rawStart += delta;
                otherPost.rawEnd += delta;
            }
        }

        if (processed % 5 === 0) {
            // Write intermediate progress
            const newRaw = raw.slice(0, enStart) + newEnContent + raw.slice(enEnd);
            writeFileSync(BLOG_FILE, newRaw, "utf8");
            saveCache();
            process.stdout.write(`\n   💾 Saved progress (${processed}/${foreign.length})\n`);
        }
    }

    // Final write
    console.log("\n\n✍️  Writing final blogData.ts...");
    const newRaw = raw.slice(0, enStart) + newEnContent + raw.slice(enEnd);
    writeFileSync(BLOG_FILE, newRaw, "utf8");
    saveCache();
    console.log(`✅ Done! EN section now has ${posts.length} fully-English posts.`);
})();
