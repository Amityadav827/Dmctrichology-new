import { NextResponse } from 'next/server';

export function proxy(request) {
  if (request.nextUrl.pathname === '/details/contact-us') {
    return NextResponse.redirect(new URL('/contact-us', request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/details/contact-us'],
};
