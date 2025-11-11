/**
 * Product URL Crawler Service
 * Crawls individual product information from e-commerce platform URLs
 */

export interface CrawledProductFromURL {
  name: string
  description?: string
  price: number
  comparePrice?: number
  images: string[]
  category?: string
  sku?: string
  variants?: Array<{
    size?: string
    color?: string
    price?: number
    stock?: number
  }>
  url?: string
  quantity?: number
  rating?: number
  totalSold?: number
}

/**
 * Detect platform from URL
 */
function detectPlatform(url: string): 'shopee' | 'lazada' | 'tiki' | 'sendo' | 'unknown' {
  if (url.includes('shopee.vn') || url.includes('shopee.com')) {
    return 'shopee'
  }
  if (url.includes('lazada.vn') || url.includes('lazada.com')) {
    return 'lazada'
  }
  if (url.includes('tiki.vn') || url.includes('tiki.com')) {
    return 'tiki'
  }
  if (url.includes('sendo.vn') || url.includes('sendo.com')) {
    return 'sendo'
  }
  return 'unknown'
}

/**
 * Get random User-Agent
 */
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  ]
  return userAgents[Math.floor(Math.random() * userAgents.length)]
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Try Shopee Product API (alternative endpoint)
 */
async function tryShopeeProductAPI(shopId: string, itemId: string): Promise<CrawledProductFromURL | null> {
  try {
    // Shopee product detail API
    const apiUrl = `https://shopee.vn/api/v4/item/get?itemid=${itemId}&shopid=${shopId}`
    
    console.log(`Trying Shopee product API: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Referer': `https://shopee.vn/product/${shopId}/${itemId}`,
        'Accept': 'application/json',
        'Accept-Language': 'vi-VN,vi;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    })
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.item && data.item.item_basic) {
        const itemBasic = data.item.item_basic
        const price = itemBasic.price ? itemBasic.price / 100000 : 0
        const priceBeforeDiscount = itemBasic.price_before_discount ? itemBasic.price_before_discount / 100000 : undefined
        
        return {
          name: itemBasic.name || '',
          description: itemBasic.description || '',
          price: price,
          comparePrice: priceBeforeDiscount && priceBeforeDiscount > price ? priceBeforeDiscount : undefined,
          images: itemBasic.images ? itemBasic.images.map((img: string) => `https://cf.shopee.vn/file/${img}`) : [],
          sku: itemId,
          url: `https://shopee.vn/product/${shopId}/${itemId}`,
          quantity: itemBasic.stock || 0,
          rating: itemBasic.item_rating?.rating_star || undefined,
          totalSold: itemBasic.sold || undefined,
        }
      }
    }
  } catch (error: any) {
    console.log(`Shopee product API failed: ${error.message}`)
  }
  
  return null
}

/**
 * Crawl product from Shopee URL
 */
async function crawlShopeeProduct(url: string): Promise<CrawledProductFromURL> {
  console.log(`Crawling Shopee product from URL: ${url}`)
  
  try {
    // Extract shop ID and item ID from URL
    // Format: https://shopee.vn/product/{shopId}/{itemId}
    const urlMatch = url.match(/shopee\.vn\/product\/(\d+)\/(\d+)/)
    if (!urlMatch) {
      throw new Error('Invalid Shopee product URL format. Expected: https://shopee.vn/product/{shopId}/{itemId}')
    }
    
    const shopId = urlMatch[1]
    const itemId = urlMatch[2]
    
    console.log(`Extracted shopId: ${shopId}, itemId: ${itemId}`)
    
    // Method 1: Try Product API first (might work even if search API is blocked)
    console.log('Method 1: Trying Shopee product detail API...')
    const apiProduct = await tryShopeeProductAPI(shopId, itemId)
    if (apiProduct && apiProduct.name) {
      console.log(`✓ Successfully crawled product using API: ${apiProduct.name}`)
      return apiProduct
    }
    
    // Method 2: Try to fetch product detail page HTML
    console.log('Method 2: Trying to fetch product page HTML...')
    const productUrl = `https://shopee.vn/product/${shopId}/${itemId}`
    
    const response = await fetch(productUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      signal: AbortSignal.timeout(30000),
    })
    
    if (!response.ok) {
      console.warn(`Failed to fetch product page: ${response.status} ${response.statusText}`)
      // If HTML fetch fails, try to return what we have from API or throw error
      if (apiProduct) {
        return apiProduct
      }
      throw new Error(`Failed to fetch product page: ${response.status} ${response.statusText}`)
    }
    
    const html = await response.text()
    console.log(`HTML fetched, length: ${html.length} characters`)
    
    // Try to extract product data from embedded JSON
    const jsonPatterns = [
      /<script[^>]*>[\s\S]*?window\.__INITIAL_STATE__\s*=\s*({.+?});[\s\S]*?<\/script>/s,
      /window\.__INITIAL_STATE__\s*=\s*({.+?});/s,
      /window\.__NEXT_DATA__\s*=\s*({.+?});/s,
      /window\.pageData\s*=\s*({.+?});/s,
      /"itemInfo":\s*({.+?}),/s,
      /"item_basic":\s*({.+?}),/s,
      /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i,
    ]
    
    for (let i = 0; i < jsonPatterns.length; i++) {
      const pattern = jsonPatterns[i]
      const match = html.match(pattern)
      
      if (match && match[1]) {
        try {
          let data: any
          try {
            data = JSON.parse(match[1])
          } catch (e) {
            // Try to extract JSON from the match
            const jsonMatch = match[1].match(/{.+}/s)
            if (jsonMatch) {
              data = JSON.parse(jsonMatch[0])
            } else {
              continue
            }
          }
          
          console.log(`Found embedded JSON data pattern ${i + 1}`)
          
          // Try to extract product info
          const product = extractShopeeProductFromData(data, itemId, shopId)
          if (product && product.name) {
            console.log(`✓ Successfully extracted product from HTML: ${product.name}`)
            return product
          }
        } catch (e: any) {
          console.log(`Failed to parse JSON pattern ${i + 1}: ${e.message}`)
        }
      }
    }
    
    // Try to find in script tags with type="application/json"
    const scriptMatches = html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi)
    for (const scriptMatch of scriptMatches) {
      try {
        const data = JSON.parse(scriptMatch[1])
        const product = extractShopeeProductFromData(data, itemId, shopId)
        if (product && product.name) {
          console.log(`✓ Successfully extracted product from JSON script tag`)
          return product
        }
      } catch (e) {
        // Continue
      }
    }
    
    // Fallback: Parse HTML directly
    console.log('No embedded JSON found, attempting HTML parsing...')
    const htmlProduct = parseShopeeProductFromHTML(html, itemId, shopId, url)
    
    if (htmlProduct.name && htmlProduct.name !== `Product ${itemId}`) {
      return htmlProduct
    }
    
    // If all methods failed, return API product if available, otherwise throw error
    if (apiProduct) {
      console.warn('HTML parsing failed, returning API product (may be incomplete)')
      return apiProduct
    }
    
    throw new Error('Could not extract product information from Shopee page')
    
  } catch (error: any) {
    console.error('Error crawling Shopee product:', error.message)
    throw new Error(`Failed to crawl Shopee product: ${error.message}`)
  }
}

/**
 * Extract Shopee product from JSON data
 */
function extractShopeeProductFromData(data: any, itemId: string, shopId: string): CrawledProductFromURL | null {
  console.log('Extracting product from data structure...')
  console.log('Data keys:', Object.keys(data).slice(0, 20))
  
  // Try various paths where product data might be stored
  const paths = [
    'itemInfo.item_basic',
    'itemInfo',
    'item_basic',
    'data.itemInfo.item_basic',
    'data.itemInfo',
    'initialState.itemInfo.item_basic',
    'pageData.itemInfo.item_basic',
    'mainInfo.item_basic',
    'product.item_basic',
    'item',
    'data.item',
    'props.pageProps.itemInfo.item_basic',
    'props.pageProps.data.itemInfo.item_basic',
  ]
  
  let itemBasic: any = null
  
  for (const path of paths) {
    const parts = path.split('.')
    let current: any = data
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        current = null
        break
      }
    }
    
    if (current && typeof current === 'object') {
      // Check if this looks like item_basic
      if (current.itemid || current.item_id || current.name) {
        itemBasic = current
        console.log(`Found product data at path: ${path}`)
        break
      }
    }
  }
  
  // If not found, try to search recursively
  if (!itemBasic) {
    console.log('Searching recursively for product data...')
    itemBasic = findShopeeProductRecursive(data, itemId)
  }
  
  if (!itemBasic) {
    console.warn('Could not find item_basic in data structure')
    // Try to find any object with name and price
    itemBasic = findProductLikeObject(data)
  }
  
  if (!itemBasic) {
    return null
  }
  
  console.log('Found item_basic:', {
    hasName: !!itemBasic.name,
    hasPrice: !!itemBasic.price,
    hasImages: !!itemBasic.images,
    itemid: itemBasic.itemid || itemBasic.item_id,
  })
  
  // Extract product information
  const price = itemBasic.price ? (typeof itemBasic.price === 'number' ? itemBasic.price / 100000 : parseFloat(itemBasic.price) / 100000) : (itemBasic.price_min ? itemBasic.price_min / 100000 : 0)
  const priceBeforeDiscount = itemBasic.price_before_discount ? (typeof itemBasic.price_before_discount === 'number' ? itemBasic.price_before_discount / 100000 : parseFloat(itemBasic.price_before_discount) / 100000) : undefined
  
  // Extract images
  const images: string[] = []
  if (itemBasic.images && Array.isArray(itemBasic.images)) {
    itemBasic.images.forEach((img: string) => {
      if (img && typeof img === 'string') {
        const imageUrl = img.startsWith('http') ? img : `https://cf.shopee.vn/file/${img}`
        if (!images.includes(imageUrl)) {
          images.push(imageUrl)
        }
      }
    })
  }
  if (itemBasic.image && typeof itemBasic.image === 'string') {
    const imageUrl = itemBasic.image.startsWith('http') ? itemBasic.image : `https://cf.shopee.vn/file/${itemBasic.image}`
    if (!images.includes(imageUrl)) {
      images.unshift(imageUrl) // Add as first image
    }
  }
  
  // Extract variants
  const variants: Array<{ size?: string; color?: string; price?: number; stock?: number }> = []
  if (itemBasic.tier_variations && Array.isArray(itemBasic.tier_variations)) {
    // Shopee variants structure - combine tier variations with models
    const tierOptions: any[] = []
    itemBasic.tier_variations.forEach((tier: any) => {
      if (tier.options && Array.isArray(tier.options)) {
        tierOptions.push({
          name: tier.name || '',
          options: tier.options,
        })
      }
    })
    
    // If we have models, combine them with tier options
    if (itemBasic.models && Array.isArray(itemBasic.models)) {
      itemBasic.models.forEach((model: any) => {
        const variant: any = {
          price: model.price ? model.price / 100000 : price,
          stock: model.stock || 0,
        }
        
        // Try to map model to tier options
        if (model.name && tierOptions.length > 0) {
          // Parse model name to extract size/color
          const modelParts = model.name.split(',')
          modelParts.forEach((part: string) => {
            const trimmed = part.trim()
            tierOptions.forEach((tier) => {
              if (tier.options.includes(trimmed)) {
                const key = tier.name?.toLowerCase() || 'option'
                if (key === 'size' || key === 'kích thước') {
                  variant.size = trimmed
                } else if (key === 'color' || key === 'màu sắc' || key === 'màu') {
                  variant.color = trimmed
                } else {
                  variant[key] = trimmed
                }
              }
            })
          })
        }
        
        variants.push(variant)
      })
    } else if (tierOptions.length > 0) {
      // Create variants from tier options only
      tierOptions.forEach((tier) => {
        tier.options.forEach((option: string) => {
          const key = tier.name?.toLowerCase() || 'option'
          const existingVariant = variants.find(v => {
            if (key === 'size' || key === 'kích thước') {
              return v.size === option
            } else if (key === 'color' || key === 'màu sắc' || key === 'màu') {
              return v.color === option
            }
            return false
          })
          
          if (!existingVariant) {
            const variant: any = { price }
            if (key === 'size' || key === 'kích thước') {
              variant.size = option
            } else if (key === 'color' || key === 'màu sắc' || key === 'màu') {
              variant.color = option
            }
            variants.push(variant)
          } else {
            if (key === 'size' || key === 'kích thước') {
              existingVariant.size = option
            } else if (key === 'color' || key === 'màu sắc' || key === 'màu') {
              existingVariant.color = option
            }
          }
        })
      })
    }
  } else if (itemBasic.models && Array.isArray(itemBasic.models)) {
    // Only models, no tier variations
    itemBasic.models.forEach((model: any) => {
      variants.push({
        price: model.price ? model.price / 100000 : price,
        stock: model.stock || 0,
      })
    })
  }
  
  // Extract description
  let description = itemBasic.description || itemBasic.desc || ''
  if (itemBasic.description && typeof itemBasic.description === 'string') {
    // Remove HTML tags if present
    description = description.replace(/<[^>]*>/g, '').trim()
  }
  
  return {
    name: itemBasic.name || itemBasic.title || `Product ${itemId}`,
    description: description,
    price: price,
    comparePrice: priceBeforeDiscount && priceBeforeDiscount > price ? priceBeforeDiscount : undefined,
    images: images.length > 0 ? images : [],
    sku: itemId,
    variants: variants.length > 0 ? variants : undefined,
    url: `https://shopee.vn/product/${shopId}/${itemId}`,
    quantity: itemBasic.stock || itemBasic.total_stock || itemBasic.quantity || 0,
    rating: itemBasic.item_rating?.rating_star || itemBasic.rating_average || itemBasic.rating || undefined,
    totalSold: itemBasic.sold || itemBasic.historical_sold || itemBasic.total_sold || undefined,
  }
}

/**
 * Find product-like object in data (fallback)
 */
function findProductLikeObject(obj: any, depth: number = 0): any {
  if (depth > 6) return null
  
  if (obj && typeof obj === 'object') {
    // Check if this object looks like a product
    if (obj.name && (obj.price || obj.price_min)) {
      return obj
    }
    
    // Recursively search
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const found = findProductLikeObject(obj[key], depth + 1)
        if (found) return found
      }
    }
  }
  
  return null
}

/**
 * Recursively find Shopee product data
 */
function findShopeeProductRecursive(obj: any, itemId: string, depth: number = 0): any {
  if (depth > 5) return null
  
  if (obj && typeof obj === 'object') {
    // Check if this object looks like a Shopee product
    if (obj.itemid?.toString() === itemId || obj.item_id?.toString() === itemId) {
      return obj
    }
    
    // Check if this is item_basic
    if (obj.itemid || obj.item_id || (obj.name && obj.price)) {
      return obj
    }
    
    // Recursively search
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const found = findShopeeProductRecursive(obj[key], itemId, depth + 1)
        if (found) return found
      }
    }
  }
  
  return null
}

/**
 * Parse Shopee product from HTML (fallback)
 */
function parseShopeeProductFromHTML(html: string, itemId: string, shopId: string, url: string): CrawledProductFromURL {
  console.log('Parsing product from HTML directly...')
  
  // Extract product name from HTML - try multiple patterns
  const namePatterns = [
    /<h1[^>]*class=["'][^"']*product-name[^"']*["'][^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /class=["']product-name["'][^>]*>([^<]+)</i,
    /<title>([^<]+)<\/title>/i,
    /data-name=["']([^"']+)["']/i,
    /"name":\s*["']([^"']+)["']/i,
  ]
  
  let name = `Product ${itemId}`
  for (const pattern of namePatterns) {
    const match = html.match(pattern)
    if (match && match[1] && match[1].trim().length > 0) {
      name = match[1].trim()
      // Clean up name (remove Shopee branding, etc.)
      name = name.replace(/\s*-\s*Shopee.*$/i, '').trim()
      if (name.length > 5) { // Only use if it's a meaningful name
        break
      }
    }
  }
  
  // Extract price - try multiple patterns
  const pricePatterns = [
    /"price":\s*(\d+)/i,
    /price["']?\s*:\s*["']?(\d+)/i,
    /data-price=["']?(\d+)/i,
    /class=["'][^"']*price[^"']*["'][^>]*>[\s\S]*?(\d+(?:\.\d+)?)[\s\S]*?<\/span>/i,
  ]
  
  let price = 0
  for (const pattern of pricePatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      const parsedPrice = parseInt(match[1])
      if (parsedPrice > 0) {
        // Shopee prices are usually in the smallest unit (divide by 100000)
        price = parsedPrice > 10000 ? parsedPrice / 100000 : parsedPrice
        break
      }
    }
  }
  
  // Extract images - try multiple patterns
  const images: string[] = []
  
  // Pattern 1: Shopee CDN URLs
  const imageMatches1 = html.matchAll(/https:\/\/cf\.shopee\.vn\/file\/([^"'\s<>]+)/gi)
  for (const match of imageMatches1) {
    const imageUrl = `https://cf.shopee.vn/file/${match[1]}`
    if (!images.includes(imageUrl)) {
      images.push(imageUrl)
    }
  }
  
  // Pattern 2: JSON image arrays
  const imageArrayMatch = html.match(/"images":\s*\[([^\]]+)\]/)
  if (imageArrayMatch) {
    const imageIds = imageArrayMatch[1].match(/"([^"]+)"/g)
    if (imageIds) {
      imageIds.forEach((imgId: string) => {
        const cleanId = imgId.replace(/"/g, '')
        const imageUrl = `https://cf.shopee.vn/file/${cleanId}`
        if (!images.includes(imageUrl)) {
          images.push(imageUrl)
        }
      })
    }
  }
  
  // Extract description
  const descPatterns = [
    /class=["'][^"']*product-description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    /class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    /"description":\s*["']([^"']+)["']/i,
  ]
  
  let description = ''
  for (const pattern of descPatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      description = match[1].trim()
      // Remove HTML tags
      description = description.replace(/<[^>]*>/g, '').trim()
      if (description.length > 10) {
        break
      }
    }
  }
  
  console.log(`Parsed from HTML: name="${name}", price=${price}, images=${images.length}`)
  
  return {
    name: name,
    description: description,
    price: price,
    images: images.length > 0 ? images : [],
    sku: itemId,
    url: url,
  }
}

/**
 * Crawl product from Tiki URL
 */
async function crawlTikiProduct(url: string): Promise<CrawledProductFromURL> {
  console.log(`Crawling Tiki product from URL: ${url}`)
  
  try {
    // Extract product ID from URL
    // Format: https://tiki.vn/{product-name}-p{id}.html
    const urlMatch = url.match(/tiki\.vn\/.*-p(\d+)\.html/)
    if (!urlMatch) {
      throw new Error('Invalid Tiki product URL format')
    }
    
    const productId = urlMatch[1]
    
    // Try Tiki API
    const apiUrl = `https://tiki.vn/api/v2/products/${productId}`
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'application/json',
        'Referer': url,
      },
      signal: AbortSignal.timeout(20000),
    })
    
    if (response.ok) {
      const data = await response.json()
      
      return {
        name: data.name || '',
        description: data.short_description || data.description || '',
        price: data.price || 0,
        comparePrice: data.list_price && data.list_price > data.price ? data.list_price : undefined,
        images: data.images ? data.images.map((img: any) => img.large_url || img.base_url || '').filter(Boolean) : [],
        sku: productId,
        url: url,
        quantity: data.quantity || 0,
        rating: data.rating_average || undefined,
        totalSold: data.order_count || undefined,
      }
    }
    
    throw new Error(`Tiki API returned ${response.status}`)
  } catch (error: any) {
    console.error('Error crawling Tiki product:', error.message)
    throw new Error(`Failed to crawl Tiki product: ${error.message}`)
  }
}

/**
 * Crawl product from Lazada URL
 */
async function crawlLazadaProduct(url: string): Promise<CrawledProductFromURL> {
  console.log(`Crawling Lazada product from URL: ${url}`)
  
  try {
    // Lazada product URL parsing
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(20000),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    
    const html = await response.text()
    
    // Try to extract JSON from pageData
    const pageDataMatch = html.match(/window\.pageData\s*=\s*({.+?});/s)
    if (pageDataMatch) {
      const data = JSON.parse(pageDataMatch[1])
      const product = data.mods?.find((mod: any) => mod.type === 'Product')
      
      if (product && product.data) {
        return {
          name: product.data.name || '',
          price: product.data.price || 0,
          comparePrice: product.data.originalPrice || undefined,
          images: product.data.images || [],
          url: url,
        }
      }
    }
    
    throw new Error('Could not extract product data from Lazada page')
  } catch (error: any) {
    console.error('Error crawling Lazada product:', error.message)
    throw new Error(`Failed to crawl Lazada product: ${error.message}`)
  }
}

/**
 * Crawl product from Sendo URL
 */
async function crawlSendoProduct(url: string): Promise<CrawledProductFromURL> {
  console.log(`Crawling Sendo product from URL: ${url}`)
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(20000),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    
    const html = await response.text()
    
    // Basic parsing for Sendo
    const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    const priceMatch = html.match(/price["']?\s*:\s*["']?(\d+)/i)
    
    return {
      name: nameMatch ? nameMatch[1].trim() : 'Product',
      price: priceMatch ? parseInt(priceMatch[1]) : 0,
      images: [],
      url: url,
    }
  } catch (error: any) {
    console.error('Error crawling Sendo product:', error.message)
    throw new Error(`Failed to crawl Sendo product: ${error.message}`)
  }
}

/**
 * Main function to crawl product from URL
 */
export async function crawlProductFromURL(url: string): Promise<CrawledProductFromURL> {
  if (!url || !url.trim()) {
    throw new Error('URL is required')
  }
  
  // Normalize URL
  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith('http')) {
    normalizedUrl = `https://${normalizedUrl}`
  }
  
  const platform = detectPlatform(normalizedUrl)
  console.log(`Detected platform: ${platform} for URL: ${normalizedUrl}`)
  
  switch (platform) {
    case 'shopee':
      return crawlShopeeProduct(normalizedUrl)
    case 'tiki':
      return crawlTikiProduct(normalizedUrl)
    case 'lazada':
      return crawlLazadaProduct(normalizedUrl)
    case 'sendo':
      return crawlSendoProduct(normalizedUrl)
    default:
      throw new Error(`Unsupported platform or invalid URL: ${url}`)
  }
}

