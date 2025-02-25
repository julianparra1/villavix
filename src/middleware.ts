// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Verificar si la ruta actual debe ser protegida
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.startsWith('/protected');

  // Si no es ruta protegida, permitir acceso
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Verificar token
  const token = request.cookies.get('sessionToken')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.nextUrl.origin);
    loginUrl.searchParams.append("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verificar token en el API route
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!verifyResponse.ok) {
      throw new Error('Token verification failed');
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);
    const loginUrl = new URL('/login', request.nextUrl.origin);
    loginUrl.searchParams.append("returnUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('sessionToken');
    return response;
  }
}

export const config = {
  matcher: [
    '/protected',
    '/protected/:path*'
  ]
};