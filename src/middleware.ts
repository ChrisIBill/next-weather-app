import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { nextUrl: url, geo } = request
    const country = geo.country || 'US'
    url.searchParams.set('country', country)
    return NextResponse.rewrite(url)
}

// See "Matching Paths" below to learn more
