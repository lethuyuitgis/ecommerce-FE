import { NextRequest, NextResponse } from 'next/server'
import FormData from 'form-data'

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

export async function handleRequest(
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
      // For file uploads, try to forward raw body first (most reliable)
      try {
        const arrayBuffer = await request.arrayBuffer()
        body = arrayBuffer
        // Remove charset parameter from Content-Type for multipart
        if (contentType) {
          let fixedContentType = contentType.replace(/;?\s*charset=[^;]+/gi, '')
          headers['Content-Type'] = fixedContentType
        }
      } catch (error) {
        console.error('Error forwarding raw FormData body:', error)
        // Fallback: parse FormData and recreate using form-data package
        try {
          const formData = await request.formData()
          const nodeFormData = new FormData()
          
          // Copy all fields from original FormData
          for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
              // Convert File to Buffer for form-data package
              const arrayBuffer = await value.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)
              nodeFormData.append(key, buffer, {
                filename: value.name || 'file',
                contentType: value.type || 'application/octet-stream',
                knownLength: buffer.length,
              })
            } else {
              nodeFormData.append(key, value as string)
            }
          }
          
          // form-data package returns a stream, forward it directly
          body = nodeFormData as any
          // Get the Content-Type from form-data (includes boundary)
          const formDataHeaders = nodeFormData.getHeaders()
          if (formDataHeaders['content-type']) {
            let contentType = formDataHeaders['content-type'] as string
            // Remove charset parameter from Content-Type for multipart
            contentType = contentType.replace(/;?\s*charset=[^;]+/gi, '')
            headers['Content-Type'] = contentType
          }
        } catch (e) {
          console.error('Error processing FormData:', e)
          throw new Error('Failed to process FormData')
        }
      }
    } else {
      // For JSON requests
      try {
        const textBody = await request.text()
        if (textBody) {
          // Debug: log request body for POST/PUT/PATCH requests
          if (['POST', 'PUT', 'PATCH'].includes(method)) {
            try {
              const parsed = JSON.parse(textBody)
              if (Array.isArray(parsed)) {
                console.warn(`[API Proxy] Warning: Request body is an array for ${method} ${path}:`, parsed)
              }
            } catch {
              // Not JSON, ignore
            }
          }
          body = textBody
          headers['Content-Type'] = 'application/json'
        }
      } catch {
        // No body
      }
    }

    // Forward the request to the backend
    // Ensure backend URL includes the API prefix expected by Spring controllers.
    // If BACKEND_URL already contains '/api' (or '/api/...'), keep it.
    // Otherwise, prepend '/api' before the forwarded path.
    const hasApiPrefix = /\/api(\/|$)/.test(BACKEND_URL)
    const normalizedBase = BACKEND_URL.replace(/\/+$/, '')
    const normalizedPath = path.replace(/^\/+/, '')
    const finalPath = hasApiPrefix ? normalizedPath : `api/${normalizedPath}`
    const backendUrl = `${normalizedBase}/${finalPath}${queryString || ''}`

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

    // Try primary URL; if 404, try alternate prefix variant to be resilient to backend base config.
    let response = await fetch(backendUrl, {
      method,
      headers,
      body: body || undefined,
    })
    if (response.status === 404) {
      // Flip api prefix existence and retry once
      const flip = hasApiPrefix
        ? normalizedBase.replace(/\/api(\/|$)/, '/') // remove /api
        : `${normalizedBase}/api`                    // add /api
      const altBase = flip.replace(/\/+$/, '')
      const altBackendUrl = `${altBase}/${normalizedPath}${queryString || ''}`
      response = await fetch(altBackendUrl, {
        method,
        headers,
        body: body || undefined,
      })
    }

    // Check if response is JSON or binary (images, files, etc.)
    const contentTypeHeader = response.headers.get('content-type')
    
    if (contentTypeHeader?.includes('application/json')) {
      // JSON response
      const data = await response.json()
      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
        },
      })
    } else if (contentTypeHeader?.includes('image/') || contentTypeHeader?.includes('video/') || contentTypeHeader?.includes('application/octet-stream')) {
      // Binary response (images, videos, files) - stream directly
      const arrayBuffer = await response.arrayBuffer()
      return new NextResponse(arrayBuffer, {
        status: response.status,
        headers: {
          'Content-Type': contentTypeHeader || 'application/octet-stream',
          'Content-Length': response.headers.get('content-length') || arrayBuffer.byteLength.toString(),
          'Cache-Control': response.headers.get('cache-control') || 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*',
        },
      })
    } else {
      // For other non-JSON responses (text, etc.), return as text
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentTypeHeader || 'text/plain',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
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
