import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Handle OPTIONS requests for CORS preflight
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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'DELETE')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params, 'PATCH')
}

async function handleRequest(
  request: NextRequest,
  params: { slug: string[] },
  method: string
) {
  try {
    const { slug } = params
    const path = slug.join('/')
    const url = new URL(request.url)
    const queryString = url.search // includes leading "?"
    
    // Check if this is a file upload (FormData)
    const contentType = request.headers.get('content-type') || ''
    const isFormData = contentType.includes('multipart/form-data')
    
    // Get request body
    let body: BodyInit | undefined
    const headers: HeadersInit = {}
    
    if (isFormData) {
      // For file uploads, get FormData
      body = await request.formData()
    } else {
      // For JSON requests
      try {
        const textBody = await request.text()
        if (textBody) {
          body = textBody
          headers['Content-Type'] = 'application/json'
        }
      } catch {
        // No body
      }
    }

    // Forward the request to the backend
    const backendUrl = `${BACKEND_URL}/${path}${queryString || ''}`

    // Forward authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Forward X-User-Id header
    const userIdHeader = request.headers.get('x-user-id')
    if (userIdHeader) {
      headers['X-User-Id'] = userIdHeader
    }

    const response = await fetch(backendUrl, {
      method,
      headers,
      body: body || undefined,
    })

    // Check if response is JSON
    const contentTypeHeader = response.headers.get('content-type')
    let data: any
    
    if (contentTypeHeader?.includes('application/json')) {
      data = await response.json()
    } else {
      // For non-JSON responses, return as text
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentTypeHeader || 'text/plain',
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
    
    // Check if it's a connection error
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
