import { NextRequest } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export async function POST(request: NextRequest) {
  const baseUrl = BACKEND_URL.replace(/\/+$/, "")
  const url = new URL(request.url)
  const query = url.search
  const target = `${baseUrl}/seller/reports/export${query}`

  const headers: HeadersInit = {}
  const authHeader = request.headers.get("authorization")
  if (authHeader) {
    headers["Authorization"] = authHeader
  }
  const userIdHeader = request.headers.get("x-user-id")
  if (userIdHeader) {
    headers["X-User-Id"] = userIdHeader
  }

  const backendResponse = await fetch(target, {
    method: "POST",
    headers,
  })

  const contentType = backendResponse.headers.get("content-type") || "application/octet-stream"
  const disposition = backendResponse.headers.get("content-disposition")

  if (!backendResponse.ok) {
    const errorBody = await backendResponse.text()
    return new Response(errorBody || "Failed to export report", {
      status: backendResponse.status,
      headers: {
        "Content-Type": contentType.includes("application/json") ? contentType : "text/plain",
      },
    })
  }

  const buffer = await backendResponse.arrayBuffer()
  const responseHeaders = new Headers()
  responseHeaders.set("Content-Type", contentType)
  if (disposition) {
    responseHeaders.set("Content-Disposition", disposition)
  }

  return new Response(buffer, {
    status: backendResponse.status,
    headers: responseHeaders,
  })
}



