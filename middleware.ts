import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Block /admin and /strapi-cms in production (allow in dev for offline Decap usage)
  if (pathname.startsWith('/admin') || pathname.startsWith('/strapi-cms')) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // 410 Gone for permanently removed old content
  const permanentlyRemovedPaths: string[] = ['/feed.xml', '/main.py', '/word'];
  if (permanentlyRemovedPaths.includes(pathname)) {
    return new NextResponse('Gone - This content has been permanently removed', {
      status: 410,
      headers: { 'Cache-Control': 'public, max-age=31536000' },
    });
  }

  // Block legacy editor routes
  if (pathname === '/editor' || pathname.startsWith('/editor/')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Redirect old blog structure
  if (pathname.startsWith('/articles')) {
    url.pathname = pathname.replace('/articles', '/blog');
    return NextResponse.redirect(url, 301);
  }

  // REMOVED: The problematic /blog/:slug redirect that was causing 404s

  // Resume tool canonicalization
  if (pathname.startsWith('/tools/resume-maker/')) {
    url.pathname = '/resume-maker';
    return NextResponse.redirect(url, 301);
  }

  // Canonical hostname (www -> root)
  if (request.nextUrl.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }

  // Specific one-offs (only if you know these exact posts exist)
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
    '/admin/:path*',
    '/strapi-cms/:path*',
    '/((?!_next/static|_next/image|favicon.ico|images|uploads|api|.*\\..*).*)',
  ],
};
