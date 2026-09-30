import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLocale } from '@/lib/locales';

export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const locale = segment && isLocale(segment) ? segment : 'ps';
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
};
