import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '../../[...slug]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, { slug: ['products', params.id] }, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, { slug: ['products', params.id] }, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, { slug: ['products', params.id] }, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(request, { slug: ['products', params.id] }, 'DELETE')
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

