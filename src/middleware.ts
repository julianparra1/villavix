// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Verificar si la ruta actual debe ser protegida
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.startsWith('/home');

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
    console.log("CCC: " + request.nextUrl.host)
    const verifyResponse = await fetch(`http://${request.nextUrl.host}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!verifyResponse.ok) {
      const loginUrl = new URL('/login', request.nextUrl.origin);
      NextResponse.redirect(loginUrl);
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
