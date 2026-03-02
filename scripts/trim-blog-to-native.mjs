/**
 * trim-blog-to-native.mjs
 * Strips the cross-translated posts from blogData.ts keeping only
 * the first 44 NATIVE posts per language section.
 * Native posts have slugs WITHOUT the "xx-" source-lang prefix.
 * Run: node scripts/trim-blog-to-native.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_FILE = join(__dirname, "../src/lib/blogData.ts");
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
                posts.push(content.slice(start, i + 1));
                start = -1;
            }
        }
    }
    return posts;
}

function getSlug(ps) {
    const m = ps.match(/slug:\s*["']([^"']+)["']/);
    return m ? m[1] : "";
}

console.log("📖 Reading blogData.ts...");
let raw = readFileSync(BLOG_FILE, "utf8");

// Find header
const firstPos = Math.min(
    ...LANGUAGES.map(l => { const p = raw.indexOf(`    "${l}": [`); return p === -1 ? Infinity : p; })
);
const header = raw.slice(0, firstPos);

const newSections = [];

for (const lang of LANGUAGES) {
    const { text } = extractSection(raw, lang);
    if (!text) { console.log(`  ⚠️  No "${lang}" section`); continue; }

    const all = extractPosts(text);
    // Native posts: slug does NOT start with any other lang prefix
    const foreignPrefixes = LANGUAGES.filter(l => l !== lang).map(l => `${l}-`);
    const native = all.filter(ps => {
        const slug = getSlug(ps);
        return !foreignPrefixes.some(pfx => slug.startsWith(pfx));
    });

    console.log(`   "${lang}": ${all.length} total → ${native.length} native`);
    newSections.push({ lang, posts: native });
}

const body = newSections.map(({ lang, posts }, i) =>
    `    "${lang}": [\n${posts.join(",\n")}\n    ]${i < newSections.length - 1 ? "," : ""}`
).join("\n");

writeFileSync(BLOG_FILE, header + body + "\n};\n", "utf8");
console.log("\n✅ Done! blogData.ts trimmed to native posts only.");
newSections.forEach(({ lang, posts }) => console.log(`   "${lang}": ${posts.length} posts`));
