import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'excel')

export async function GET(request: NextRequest) {
  try {
    // Get authorization headers
    const authHeader = request.headers.get('authorization')

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

    // Check if upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      return NextResponse.json({
        success: true,
        data: {
          files: [],
          total: 0,
        },
      })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Read directory
    const files = await readdir(UPLOAD_DIR)

    // Get file details
    const fileDetails = await Promise.all(
      files
        .filter(file => /\.(xlsx|xls|csv)$/i.test(file))
        .slice(offset, offset + limit)
        .map(async (file) => {
          const filePath = join(UPLOAD_DIR, file)
          const fileStat = await stat(filePath)
          
          return {
            fileName: file,
            fileUrl: `/uploads/excel/${file}`,
            size: fileStat.size,
            uploadedAt: fileStat.birthtime.toISOString(),
            modifiedAt: fileStat.mtime.toISOString(),
          }
        })
    )

    // Sort by uploaded date (newest first)
    fileDetails.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )

    return NextResponse.json({
      success: true,
      data: {
        files: fileDetails,
        total: files.filter(file => /\.(xlsx|xls|csv)$/i.test(file)).length,
        limit,
        offset,
      },
    })
  } catch (error: any) {
    console.error('List files error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to list files',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

