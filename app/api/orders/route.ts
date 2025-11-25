import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

async function proxyRequest(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url)
    const queryString = url.search
    const backendUrl = `${BACKEND_URL}/orders${queryString || ''}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    const userIdHeader = request.headers.get('x-user-id')
    if (userIdHeader) {
      headers['X-User-Id'] = userIdHeader
    }

    let body: BodyInit | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const textBody = await request.text()
        if (textBody) {
          body = textBody
        }
      } catch {
        // No body
      }
    }

    const response = await fetch(backendUrl, {
      method,
      headers,
      body: body || undefined,
    })

    const contentType = response.headers.get('content-type')
    let data: any

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentType || 'text/plain',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
      },
    })
  } catch (error: any) {
    console.error('API Proxy Error:', error)
    
    if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        {
          success: false,
          message: `Backend server is not running. Please start the backend server at ${BACKEND_URL}`,
          error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { 
          status: 503,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to connect to backend server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE')
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, 'PATCH')
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

