import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_SKILLSPRINT_KEY_31564696";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  const validToken = token ? await verifyToken(token) : null
  // Redirect to login if unauthenticated and trying to access protected route
  if (!validToken && !isAuthPage) {
    if (
      request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname === '/favicon.ico'
    ) {
      return NextResponse.next()
    }
    const response = NextResponse.redirect(new URL('/login', request.url))
    if (token) {
      response.cookies.delete('auth_token')
    }
    return response
  }

  // Redirect to home if authenticated and trying to access auth pages
  if (validToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
