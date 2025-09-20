import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Return 410 Gone for permanently removed old content (better than 404 for SEO)
  const permanentlyRemovedPaths: string[] = [
    '/feed.xml', 
    '/main.py',
    '/word',
  ];
  
  if (permanentlyRemovedPaths.includes(pathname)) {
    return new NextResponse('Gone - This content has been permanently removed', { 
      status: 410,
      headers: {
        'Cache-Control': 'public, max-age=31536000' // Cache 410 responses for 1 year
      }
    });
  }

  // Block editor routes completely (since Decap CMS handles content)
  if (pathname.startsWith('/editor') || pathname === '/editor') {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Redirect old blog structure to new structure (301 permanent redirect)
  if (pathname.startsWith('/articles')) {
    url.pathname = pathname.replace('/articles', '/blog');
    return NextResponse.redirect(url, 301);
  }

  // Redirect old blog posts without category to general category
  const oldBlogPattern = /^\/blog\/([^\/]+)$/;
  const match = pathname.match(oldBlogPattern);
  if (match && !['AI', 'coding', 'drama', 'film', 'general', 'shopping'].includes(match[1])) {
    // If it's not a category, assume it's a slug and redirect to general
    url.pathname = `/blog/general/${match[1]}`;
    return NextResponse.redirect(url, 301);
  }

  // Redirect resume maker variants to main resume maker (301 permanent redirect)
  if (pathname.startsWith('/tools/resume-maker/')) {
    url.pathname = '/resume-maker';
    return NextResponse.redirect(url, 301);
  }

  // Canonical URL redirects (www to non-www)
  if (request.nextUrl.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }

  // Handle specific old URLs that show up in Google Search Console
  const specificOldUrls: Record<string, string> = {
    '/blog/tech-trends-2025': '/blog/general/tech-trends-2025',
    '/blog/ai-revolution-2025': '/blog/AI/ai-revolution-2025', 
    '/blog/productivity-tools-comparison-2025': '/blog/general/productivity-tools-comparison-2025',
    '/blog/top-coding-frameworks': '/blog/coding/top-coding-frameworks',
    '/blog/productivity-mastery-2025': '/blog/general/productivity-mastery-2025',
  };

  if (specificOldUrls[pathname]) {
    url.pathname = specificOldUrls[pathname];
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, API routes, and admin
    '/((?!_next/static|_next/image|favicon.ico|images|admin|api).*)',
  ],
};