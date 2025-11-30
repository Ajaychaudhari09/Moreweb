import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const start = Date.now();
    const response = await next();
    const end = Date.now();
    const duration = end - start;

    // Log request duration (server-side only)
    console.log(`[${context.request.method}] ${context.url.pathname} - ${duration}ms`);

    // Add custom header
    response.headers.set("X-Powered-By", "MoreFusion Astro");

    return response;
});
