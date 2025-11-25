import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '../../[...slug]/route'

const slugPath = ['payment', 'process']

export async function POST(request: NextRequest) {
  return handleRequest(request, { slug: slugPath }, 'POST')
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

