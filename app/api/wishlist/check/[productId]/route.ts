import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '../../../[...slug]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> | { productId: string } }
) {
  const resolvedParams = params instanceof Promise ? await params : params
  return handleRequest(request, { slug: ['wishlist', 'check', resolvedParams.productId] }, 'GET')
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
    },
  })
}

