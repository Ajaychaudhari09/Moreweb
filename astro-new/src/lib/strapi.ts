import type { BlogPost, BlogCategory } from "@/types";
import { normalizeCategory } from "./utils";

interface StrapiPost {
    id: number;
    attributes: {
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        publishedAt: string;
        author: string;
        category: string;
        tags: string; // Strapi often returns tags as a string or relation, assuming string or JSON here
        image: {
            data: {
                attributes: {
                    url: string;
                };
            };
        };
    };
}

export async function fetchStrapiPosts(): Promise<BlogPost[]> {
    const STRAPI_URL = import.meta.env.STRAPI_URL || "http://127.0.0.1:1337";

    try {
        // Check if Strapi is reachable
        const healthCheck = await fetch(`${STRAPI_URL}/api/blogs?pagination[pageSize]=1`);
        if (!healthCheck.ok) return [];

        const res = await fetch(`${STRAPI_URL}/api/blogs?populate=*`);
        const data = await res.json();

        if (!data.data) return [];

        return data.data.map((post: StrapiPost) => {
            const attr = post.attributes;
            const category = normalizeCategory(attr.category) || "general";

            // Calculate read time
            const wordCount = (attr.content || "").trim().split(/\s+/).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));

            // Handle tags
            let tags: string[] = [];
            if (typeof attr.tags === 'string') {
                tags = attr.tags.split(',').map(t => t.trim());
            }

            return {
                id: `strapi-${post.id}`,
                slug: attr.slug,
                title: attr.title,
                excerpt: attr.excerpt || "",
                date: attr.publishedAt,
                author: attr.author || "MoreFusion Team",
                category: category as BlogCategory,
                tags: tags,
                image: attr.image?.data?.attributes?.url ? `${STRAPI_URL}${attr.image.data.attributes.url}` : undefined,
                content: attr.content,
                readTime,
            };
        });
    } catch (error) {
        console.warn("Strapi connection failed or no data found. Using local content only.");
        return [];
    }
}
