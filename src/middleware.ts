import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic'
      }
    })
  }
}

export const config = {
  matcher: '/admin/:path*'
}

async function isAuthenticated(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!authHeader) return false

  const [username, password] = Buffer.from(authHeader?.split(' ')[1], 'base64').toString().split(':')

  if (username === process.env.ADMIN_USERNAME && await hashPassword(password) === process.env.ADMIN_HASHED_PASSWORD) return true

}

async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(password))
  return Buffer.from(arrayBuffer).toString('base64')
}