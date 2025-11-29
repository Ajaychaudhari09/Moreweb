import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../src/content/blog');

async function fetchStrapiPosts() {
    console.log(`Fetching posts from ${STRAPI_URL}...`);
    try {
        const res = await fetch(`${STRAPI_URL}/api/blogs?populate=*&pagination[pageSize]=100`);
        if (!res.ok) {
            throw new Error(`Failed to fetch from Strapi: ${res.statusText}`);
        }
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching from Strapi:", error);
        return [];
    }
}

function normalizeCategory(cat) {
    if (!cat) return "general";
    return cat.toLowerCase().trim().replace(/\s+/g, '-');
}

async function sync() {
    const posts = await fetchStrapiPosts();
    console.log(`Found ${posts.length} posts.`);

    for (const post of posts) {
        const attr = post.attributes;
        const category = normalizeCategory(attr.category);
        const slug = attr.slug;

        if (!slug) {
            console.warn(`Skipping post ${post.id} without slug.`);
            continue;
        }

        const dirPath = path.join(CONTENT_DIR, category);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, `${slug}.md`);

        // Handle tags
        let tags = [];
        if (typeof attr.tags === 'string') {
            tags = attr.tags.split(',').map(t => t.trim());
        } else if (Array.isArray(attr.tags)) {
            tags = attr.tags; // Assuming it might be an array in some cases
        }

        // Handle image
        let image = "";
        if (attr.image?.data?.attributes?.url) {
            image = `${STRAPI_URL}${attr.image.data.attributes.url}`;
        }

        const frontmatter = [
            '---',
            `title: "${attr.title.replace(/"/g, '\\"')}"`,
            `date: "${attr.publishedAt}"`,
            `excerpt: "${(attr.excerpt || "").replace(/"/g, '\\"')}"`,
            `author: "${attr.author || "MoreFusion Team"}"`,
            `image: "${image}"`,
            `tags: ${JSON.stringify(tags)}`,
            '---',
            '',
            attr.content || ""
        ].join('\n');

        fs.writeFileSync(filePath, frontmatter);
        console.log(`Saved: ${category}/${slug}.md`);
    }
    console.log("Sync complete.");
}

sync();
