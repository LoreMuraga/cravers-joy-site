import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Temporarily disable all middleware checks for testing
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
