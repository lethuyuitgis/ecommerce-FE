import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '../../[...slug]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  return handleRequest(request, { slug: ['payment', params.paymentId] }, 'GET')
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

