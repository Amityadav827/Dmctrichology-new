import { NextResponse } from 'next/server';
import { buildServiceDetailPath, isReservedRootSlug } from './utils/serviceRoutes';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function isServiceDetailSlug(slug) {
  try {
    const response = await fetch(`${API_BASE}/service-details/${slug}`, {
      cache: 'no-store',
      headers: {
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const json = await response.json();
    return Boolean(json?.success && json?.data);
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);

  if (request.nextUrl.pathname === '/details/contact-us') {
    return NextResponse.redirect(new URL('/contact-us', request.url), 301);
  }

  if (segments[0] === 'details' && segments.length === 2) {
    return NextResponse.redirect(new URL(buildServiceDetailPath(segments[1]), request.url), 301);
  }

  if (segments.length === 1) {
    const [slug] = segments;

    if (!slug || slug.includes('.') || isReservedRootSlug(slug)) {
      return NextResponse.next();
    }

    if (await isServiceDetailSlug(slug)) {
      return NextResponse.rewrite(new URL(`/details/${slug}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/details/:path*', '/:path*'],
};
