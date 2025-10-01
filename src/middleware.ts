import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // الصفحات التي تتطلب تسجيل دخول
  const protectedRoutes = ['/admin', '/user'];
  
  // التحقق من وجود token في cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // إذا كان المستخدم يحاول الوصول لصفحة محمية بدون token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // لا نعيد توجيه المستخدم من صفحة تسجيل الدخول حتى لو كان لديه token
  // نترك AuthContext يتعامل مع هذا
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
