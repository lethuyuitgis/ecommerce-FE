import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'excel')

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

/**
 * Generate unique filename
 */
function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '_')
  return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization headers
    const authHeader = request.headers.get('authorization')
    const userIdHeader = request.headers.get('x-user-id')

    // Check authentication (optional - can be removed if not needed)
    // if (!authHeader) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: 'Unauthorized. Please provide authentication token.',
    //     },
    //     { status: 401 }
    //   )
    // }

    // Get FormData from request
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: 'File is required',
        },
        { status: 400 }
      )
    }

    // Check file type
    const fileExtension = file.name.toLowerCase()
    const allowedExtensions = ['.xlsx', '.xls', '.csv']
    const isValidFile = allowedExtensions.some(ext => fileExtension.endsWith(ext))

    if (!isValidFile) {
      return NextResponse.json(
        {
          success: false,
          message: 'File must be Excel format (.xlsx, .xls) or CSV',
        },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: 'File size must be less than 10MB',
        },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Read file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Generate unique filename
    const savedFileName = generateFileName(file.name)
    const filePath = join(UPLOAD_DIR, savedFileName)

    // Save file to disk
    await writeFile(filePath, fileBuffer)

    // Get file URL (relative path)
    const fileUrl = `/uploads/excel/${savedFileName}`

    // Optional: Save file metadata to database
    // You can add database logic here to track uploaded files

    return NextResponse.json({
      success: true,
      data: {
        fileName: savedFileName,
        originalName: file.name,
        filePath: filePath,
        fileUrl: fileUrl,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        userId: userIdHeader || null,
      },
      message: 'File uploaded successfully',
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to upload file',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
    },
  })
}
