import { NextRequest, NextResponse } from 'next/server'
import { readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'excel')

/**
 * GET - Download file
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params

    // Security: prevent path traversal
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file name',
        },
        { status: 400 }
      )
    }

    const filePath = join(UPLOAD_DIR, fileName)

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          message: 'File not found',
        },
        { status: 404 }
      )
    }

    // Read file
    const fileBuffer = await readFile(filePath)

    // Determine content type
    const contentType = fileName.endsWith('.csv')
      ? 'text/csv'
      : fileName.endsWith('.xlsx')
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/vnd.ms-excel'

    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('Download file error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to download file',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete file
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    // Get authorization headers
    const authHeader = request.headers.get('authorization')

    // Check authentication
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Please provide authentication token.',
        },
        { status: 401 }
      )
    }

    const { fileName } = await params

    // Security: prevent path traversal
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file name',
        },
        { status: 400 }
      )
    }

    const filePath = join(UPLOAD_DIR, fileName)

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          message: 'File not found',
        },
        { status: 404 }
      )
    }

    // Delete file
    await unlink(filePath)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete file',
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
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

