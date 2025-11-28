import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        date: z.date().or(z.string()).optional(),
        author: z.string().default('MoreFusion Team'),
        category: z.string().optional(),
        tags: z.array(z.string()).default([]),
        image: z.string().optional(),
        published_date: z.date().or(z.string()).optional(), // Legacy support
    }),
});

export const collections = { blog };
