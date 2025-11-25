/**
 * Normalize image URL to ensure it works correctly
 * Handles both relative and absolute URLs
 * Converts MinIO URLs to Next.js proxy URLs
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) {
    return '/placeholder.svg'
  }

  // Convert MinIO URLs (http://localhost:9000/shopcuathuy/...) to proxy URLs
  // Pattern: http://localhost:9000/shopcuathuy/images/xxx or http://localhost:9000/shopcuathuy/products/xxx
  if (url.startsWith('http://localhost:9000/') || url.startsWith('https://localhost:9000/')) {
    // Extract the object path after bucket name
    // Example: http://localhost:9000/shopcuathuy/images/xxx.webp -> images/xxx.webp
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(p => p)
    if (pathParts.length > 1) {
      // Remove bucket name (first part), keep the rest
      const objectPath = pathParts.slice(1).join('/')
      return `/api/upload/image/${objectPath}`
    }
  }

  // If it's already an absolute URL (http/https) but not localhost:9000, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If it's a relative URL starting with /api/upload/image, it will be proxied by Next.js
  // Return as is - Next.js will proxy it to backend
  if (url.startsWith('/api/upload/image/')) {
    return url
  }

  // If it's a relative URL starting with /, return as is
  if (url.startsWith('/')) {
    return url
  }

  // If it's a relative path without leading slash, add /api/upload/image/ prefix
  // This handles cases where backend returns just the object name
  if (url.includes('images/') || url.includes('videos/') || url.includes('products/')) {
    return `/api/upload/image/${url}`
  }

  // Default: treat as relative path and proxy through upload endpoint
  return `/api/upload/image/${url}`
}

/**
 * Get multiple image URLs
 */
export function getImageUrls(urls: (string | null | undefined)[]): string[] {
  return urls.map(getImageUrl).filter(url => url !== '/placeholder.svg' || urls.length === 0)
}

