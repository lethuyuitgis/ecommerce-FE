/**
 * Web Crawler Service
 * Handles crawling products from various e-commerce platforms
 */

export interface CrawledProduct {
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
}

export interface CrawlOptions {
  category: string
  platform: 'shopee' | 'lazada' | 'tiki' | 'sendo'
  limit: number
  page?: number
}

/**
 * Map category slug to platform-specific category ID or URL
 * 
 * Note: These mappings should match the category slugs from your database/API
 * If a category slug doesn't match, the crawler will try to use it as a category ID directly
 */
const categoryMapping: Record<string, Record<string, string>> = {
  shopee: {
    'dien-thoai-phu-kien': '11036030',
    'thoi-trang-nam': '11035567',
    'thiet-bi-dien-tu': '11036032',
    'may-tinh-laptop': '11036033',
    'may-anh-may-quay-phim': '11036031',
    'dong-ho': '11036035',
    'giay-dep-nam': '11036036',
    'thiet-bi-dien-gia-dung': '11036037',
    'the-thao-du-lich': '11036038',
    'o-to-xe-may-xe-dap': '11036039',
    'thoi-trang-nu': '11036040',
    'me-be': '11036041',
    'nha-cua-doi-song': '11036042',
    'sac-dep': '11036043',
    'suc-khoe': '11036044',
    'giay-dep-nu': '11036045',
    'tui-vi-nu': '11036046',
    'phu-kien-trang-suc-nu': '11036047',
    'bach-hoa-online': '11036048',
    'nha-sach-online': '11036049',
    'balo-tui-vi-nam': '11036050',
    'do-choi': '11036051',
    'cham-soc-thu-cung': '11036052',
    'thoi-trang-tre-em': '11036053',
    'giat-giu-cham-soc-nha-cua': '11036054',
    'voucher-dich-vu': '11036055',
  },
  lazada: {
    'dien-thoai-phu-kien': '10000689',
    'thoi-trang-nam': '10000732',
    'thiet-bi-dien-tu': '10000690',
    'may-tinh-laptop': '10000691',
    'may-anh-may-quay-phim': '10000692',
    'dong-ho': '10000693',
  },
  tiki: {
    'dien-thoai-phu-kien': '1789',
    'thoi-trang-nam': '1784',
    'thiet-bi-dien-tu': '4221',
    'may-tinh-laptop': '1846',
    'may-anh-may-quay-phim': '1883',
    'dong-ho': '1914',
  },
  sendo: {
    'dien-thoai-phu-kien': '1001',
    'thoi-trang-nam': '1002',
    'thiet-bi-dien-tu': '1003',
    'may-tinh-laptop': '1004',
  },
}

/**
 * Sleep utility function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Add random delay to avoid rate limiting
      if (attempt > 0) {
        const delay = initialDelay * Math.pow(2, attempt - 1) + Math.random() * 1000
        await sleep(delay)
      }
      
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // If it's a rate limit error and we have retries left, continue
      if (error.message?.includes('rate limited') || error.message?.includes('429')) {
        if (attempt < maxRetries - 1) {
          console.log(`Rate limited, retrying in ${initialDelay * Math.pow(2, attempt)}ms... (attempt ${attempt + 1}/${maxRetries})`)
          continue
        }
      }
      
      // For other errors, throw immediately
      throw error
    }
  }
  
  throw lastError
}

/**
 * Generate random user agent
 */
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  ]
  return userAgents[Math.floor(Math.random() * userAgents.length)]
}

/**
 * Get Shopee category ID from Shopee categories API
 * This ensures we're using the correct, up-to-date category IDs
 * Returns category info including catid, display_name, and children
 */
async function getShopeeCategoryIdFromAPI(categorySlug: string): Promise<{ catid: string; display_name: string; children?: any[] } | null> {
  try {
    // Try to get categories from Shopee API
    const categoriesUrl = 'https://shopee.vn/api/v4/pages/get_category_tree'
    
    console.log('Fetching Shopee categories from API...')
    
    const response = await fetch(categoriesUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Referer': 'https://shopee.vn/',
        'Accept': 'application/json',
        'Accept-Language': 'vi-VN,vi;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    })
    
    if (response.ok) {
      const data = await response.json()
      const categoryList = data.data?.category_list || data.category_list || []
      
      console.log(`Found ${categoryList.length} categories in Shopee API`)
      
      // Normalize category slug for matching
      // "thoi-trang-nam" -> "thời trang nam"
      const categorySlugLower = categorySlug.toLowerCase().trim()
      const categorySlugNormalized = categorySlugLower.replace(/-/g, ' ')
      
      // Try exact match first, then fuzzy match
      for (const cat of categoryList) {
        // Check main category by catid (if slug is numeric)
        if (/^\d+$/.test(categorySlug) && cat.catid?.toString() === categorySlug) {
          console.log(`✓ Found category by catid: "${cat.display_name}" (${cat.name}) -> catid: ${cat.catid}`)
          console.log(`Category has ${cat.children?.length || 0} children/subcategories`)
          return {
            catid: cat.catid.toString(),
            display_name: cat.display_name || cat.name,
            children: cat.children || [],
          }
        }
        
        // Check by display_name or name
        const displayName = (cat.display_name || '').toLowerCase().trim()
        const name = (cat.name || '').toLowerCase().trim()
        const catSlugFromName = displayName.replace(/\s+/g, '-')
        
        // Exact match
        if (catSlugFromName === categorySlugLower || 
            displayName === categorySlugNormalized ||
            name === categorySlugNormalized) {
          console.log(`✓ Found exact category match: "${cat.display_name}" (${cat.name}) -> catid: ${cat.catid}`)
          console.log(`Category has ${cat.children?.length || 0} children/subcategories`)
          return {
            catid: cat.catid.toString(),
            display_name: cat.display_name || cat.name,
            children: cat.children || [],
          }
        }
        
        // Partial match
        if (displayName.includes(categorySlugNormalized) || 
            categorySlugNormalized.includes(displayName) ||
            name.includes(categorySlugNormalized) ||
            categorySlugNormalized.includes(name)) {
          console.log(`✓ Found partial category match: "${cat.display_name}" (${cat.name}) -> catid: ${cat.catid}`)
          console.log(`Category has ${cat.children?.length || 0} children/subcategories`)
          return {
            catid: cat.catid.toString(),
            display_name: cat.display_name || cat.name,
            children: cat.children || [],
          }
        }
        
        // Also check children categories (subcategories)
        if (cat.children && Array.isArray(cat.children)) {
          for (const child of cat.children) {
            const childDisplayName = (child.display_name || '').toLowerCase().trim()
            const childName = (child.name || '').toLowerCase().trim()
            const childSlugFromName = childDisplayName.replace(/\s+/g, '-')
            
            if (childSlugFromName === categorySlugLower ||
                childDisplayName === categorySlugNormalized ||
                childName === categorySlugNormalized ||
                childDisplayName.includes(categorySlugNormalized) ||
                categorySlugNormalized.includes(childDisplayName)) {
              console.log(`✓ Found subcategory match: "${child.display_name}" (${child.name}) -> catid: ${child.catid}`)
              return {
                catid: child.catid.toString(),
                display_name: child.display_name || child.name,
                children: child.children || [],
              }
            }
          }
        }
      }
      
      // If not found by slug, try to find by catid if slug is numeric
      if (/^\d+$/.test(categorySlug)) {
        console.log(`Category slug is numeric, searching by catid directly...`)
        for (const cat of categoryList) {
          if (cat.catid?.toString() === categorySlug) {
            console.log(`✓ Found category by numeric catid: "${cat.display_name}" (${cat.name}) -> catid: ${cat.catid}`)
            console.log(`Category has ${cat.children?.length || 0} children/subcategories`)
            return {
              catid: cat.catid.toString(),
              display_name: cat.display_name || cat.name,
              children: cat.children || [],
            }
          }
          
          // Also check children
          if (cat.children && Array.isArray(cat.children)) {
            for (const child of cat.children) {
              if (child.catid?.toString() === categorySlug) {
                console.log(`✓ Found subcategory by numeric catid: "${child.display_name}" (${child.name}) -> catid: ${child.catid}`)
                return {
                  catid: child.catid.toString(),
                  display_name: child.display_name || child.name,
                  children: child.children || [],
                }
              }
            }
          }
        }
      }
      
      console.warn(`Category "${categorySlug}" not found in Shopee API categories`)
      console.log('Available categories:', categoryList.map((c: any) => ({
        catid: c.catid,
        display_name: c.display_name,
        name: c.name,
      })).slice(0, 10))
    } else {
      console.warn(`Failed to fetch categories: ${response.status} ${response.statusText}`)
    }
  } catch (error: any) {
    console.warn(`Failed to fetch categories from Shopee API: ${error.message}`)
  }
  
  return null
}

/**
 * Crawl products from Shopee with retry logic and rate limit handling
 * Uses Shopee's public search API
 * This is the public function called from crawlCategory
 */
async function crawlShopee(options: CrawlOptions): Promise<CrawledProduct[]> {
  const { category, limit } = options
  
  // Try to get category ID from API first
  const categoryInfo = await getShopeeCategoryIdFromAPI(category)
  let categoryId: string | null = categoryInfo?.catid || null
  
  // Fallback to static mapping
  if (!categoryId) {
    // Get category ID from mapping
    // First, try exact match
    categoryId = categoryMapping.shopee[category]
    
    if (categoryId) {
      console.log(`✓ Found exact category mapping: "${category}" -> "${categoryId}"`)
    } else {
      // Try normalized match (remove special chars, lowercase)
      const normalizedCategory = category.toLowerCase().trim().replace(/[^a-z0-9]/g, '-')
      categoryId = categoryMapping.shopee[normalizedCategory]
      
      if (categoryId) {
        console.log(`✓ Found normalized category mapping: "${category}" (normalized: "${normalizedCategory}") -> "${categoryId}"`)
      } else {
        // Check if category is already a numeric ID
        if (/^\d+$/.test(category.trim())) {
          categoryId = category.trim()
          console.log(`✓ Using category as categoryId (numeric): ${categoryId}`)
        } else {
          // Try partial/fuzzy matching
          const categoryLower = category.toLowerCase().trim()
          const foundKey = Object.keys(categoryMapping.shopee).find(key => {
            const keyLower = key.toLowerCase()
            return keyLower === categoryLower ||
                   keyLower.includes(categoryLower) ||
                   categoryLower.includes(keyLower) ||
                   keyLower.replace(/[^a-z0-9]/g, '') === categoryLower.replace(/[^a-z0-9]/g, '')
          })
          
          if (foundKey) {
            categoryId = categoryMapping.shopee[foundKey]
            console.log(`✓ Found fuzzy category mapping: "${category}" -> "${foundKey}" -> "${categoryId}"`)
          } else {
            // Last resort: use category as-is
            categoryId = category
            console.error(`✗ Category "${category}" NOT FOUND in mapping!`)
            console.error(`  Available Shopee categories:`, Object.keys(categoryMapping.shopee).join(', '))
            console.error(`  Using "${category}" as categoryId. This will likely fail.`)
            console.error(`  Please check if the category slug matches one of the available categories.`)
          }
        }
      }
    }
  }

  console.log(`Crawling Shopee: category="${category}", categoryId="${categoryId}", limit=${limit}`)
  console.log(`Category info:`, categoryInfo ? {
    catid: categoryInfo.catid,
    display_name: categoryInfo.display_name,
    hasChildren: !!categoryInfo.children,
    childrenCount: categoryInfo.children?.length || 0,
  } : 'Not available (using static mapping)')
  
  // Validate categoryId is numeric
  if (!/^\d+$/.test(categoryId)) {
    console.error(`Invalid categoryId: "${categoryId}". Must be numeric.`)
    throw new Error(`Invalid category ID for "${category}": ${categoryId}`)
  }
  
  // If categoryInfo is not available but we have categoryId, try to fetch it again
  // This ensures we have children information for subcategory crawling
  if (!categoryInfo) {
    console.log(`Category info not available, trying to fetch from API with categoryId...`)
    const fetchedCategoryInfo = await getShopeeCategoryIdFromAPI(categoryId)
    if (fetchedCategoryInfo) {
      console.log(`✓ Successfully fetched category info from API`)
      return crawlShopeeForCategoryId(categoryId, limit, fetchedCategoryInfo)
    } else {
      console.warn(`Could not fetch category info from API. Will try to crawl without subcategories.`)
    }
  }
  
  // Call internal function with category info
  return crawlShopeeForCategoryId(categoryId, limit, categoryInfo || undefined)
}

/**
 * Try to crawl Shopee using search API with category name as keyword
 * This might work when category API is blocked
 */
async function crawlShopeeBySearch(categoryName: string, limit: number): Promise<CrawledProduct[]> {
  try {
    console.log(`Attempting Shopee search API with keyword: "${categoryName}"`)
    
    // Use search API instead of category API
    const searchUrl = `https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(categoryName)}&limit=${Math.min(limit, 60)}&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Referer': `https://shopee.vn/search?keyword=${encodeURIComponent(categoryName)}`,
        'Accept': 'application/json',
        'Accept-Language': 'vi-VN,vi;q=0.9',
      },
      signal: AbortSignal.timeout(20000),
    })
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        console.log(`✓ Found ${data.items.length} products using search API`)
        return data.items.slice(0, limit).map((item: any) => mapShopeeItemToProduct(item))
      }
    } else {
      console.warn(`Search API returned ${response.status}`)
    }
  } catch (error: any) {
    console.warn(`Search API failed: ${error.message}`)
  }
  
  return []
}

/**
 * Parse HTML from Shopee category page to extract products
 * This is a fallback when API endpoints are blocked
 */
async function parseShopeeHTML(categoryId: string, limit: number): Promise<CrawledProduct[]> {
  try {
    console.log(`Attempting to parse HTML from Shopee category page: cat.${categoryId}`)
    
    const url = `https://shopee.vn/cat.${categoryId}`
    
    const response = await fetch(url, {
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
      console.warn(`Failed to fetch HTML: ${response.status} ${response.statusText}`)
      return []
    }
    
    const html = await response.text()
    console.log(`HTML fetched, length: ${html.length} characters`)
    
    // Try to extract JSON data from script tags
    // Shopee often embeds product data in various script tags
    const jsonPatterns = [
      /window\.__INITIAL_STATE__\s*=\s*({.+?});/s,
      /window\.__NEXT_DATA__\s*=\s*({.+?});/s,
      /window\.pageData\s*=\s*({.+?});/s,
      /__NEXT_DATA__["']\s*:\s*({.+?})/s,
      /"items":\s*\[({.+?})\]/s,
      /<script[^>]*>[\s\S]*?"items":\s*\[([\s\S]+?)\][\s\S]*?<\/script>/,
    ]
    
    for (let i = 0; i < jsonPatterns.length; i++) {
      const pattern = jsonPatterns[i]
      const match = html.match(pattern)
      
      if (match && match[1]) {
        try {
          // Try to parse as JSON
          let data: any
          if (match[1].startsWith('{')) {
            data = JSON.parse(match[1])
          } else {
            // Might be just the items array
            data = { items: JSON.parse(`[${match[1]}]`) }
          }
          
          console.log(`Found embedded JSON data pattern ${i + 1}`)
          
          // Try to find products in various locations
          const products = extractProductsFromShopeeData(data, limit)
          if (products.length > 0) {
            console.log(`✓ Extracted ${products.length} products from HTML`)
            return products
          }
        } catch (e: any) {
          console.log(`Failed to parse JSON pattern ${i + 1}: ${e.message}`)
          // Continue to next pattern
        }
      }
    }
    
    // Try to find product data in script tags with type="application/json"
    const scriptMatches = html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi)
    for (const scriptMatch of scriptMatches) {
      try {
        const data = JSON.parse(scriptMatch[1])
        const products = extractProductsFromShopeeData(data, limit)
        if (products.length > 0) {
          console.log(`✓ Extracted ${products.length} products from JSON script tag`)
          return products
        }
      } catch (e) {
        // Continue
      }
    }
    
    // If no JSON found, try to parse HTML directly (basic parsing)
    console.log('No embedded JSON found, attempting basic HTML parsing...')
    return parseShopeeHTMLBasic(html, limit)
    
  } catch (error: any) {
    console.error('Error parsing Shopee HTML:', error.message)
    return []
  }
}

/**
 * Extract products from Shopee's embedded JSON data
 */
function extractProductsFromShopeeData(data: any, limit: number): CrawledProduct[] {
  const products: CrawledProduct[] = []
  
  // Try various paths where products might be stored
  const paths = [
    'items',
    'data.items',
    'products',
    'data.products',
    'searchResult.items',
    'category.items',
    'pageData.items',
    'initialState.items',
    'mainInfo.items',
    'listItems',
    'data.listItems',
    'result.items',
    'data.result.items',
    'search.items',
    'categoryData.items',
  ]
  
  // Also try to find arrays that look like product arrays
  function findProductArrays(obj: any, depth: number = 0): any[] {
    if (depth > 5) return [] // Limit recursion
    
    const arrays: any[] = []
    
    if (Array.isArray(obj)) {
      // Check if this array contains product-like objects
      if (obj.length > 0 && obj[0] && typeof obj[0] === 'object') {
        const firstItem = obj[0]
        // Check if it looks like a Shopee product
        if (firstItem.item_basic || firstItem.itemid || firstItem.name || firstItem.price) {
          arrays.push(obj)
        }
      }
    } else if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          arrays.push(...findProductArrays(obj[key], depth + 1))
        }
      }
    }
    
    return arrays
  }
  
  // Try explicit paths first
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
    
    if (Array.isArray(current) && current.length > 0) {
      console.log(`Found products at path: ${path} (${current.length} items)`)
      const mapped = current.slice(0, limit).map((item: any) => mapShopeeItemToProduct(item))
      if (mapped.length > 0 && mapped[0].name) {
        return mapped
      }
    }
  }
  
  // If no explicit path worked, try to find product arrays recursively
  console.log('No products found in explicit paths, searching recursively...')
  const foundArrays = findProductArrays(data)
  
  for (const arr of foundArrays) {
    if (Array.isArray(arr) && arr.length > 0) {
      console.log(`Found potential product array with ${arr.length} items`)
      const mapped = arr.slice(0, limit).map((item: any) => mapShopeeItemToProduct(item))
      if (mapped.length > 0 && mapped[0].name) {
        console.log(`✓ Successfully extracted ${mapped.length} products from recursive search`)
        return mapped
      }
    }
  }
  
  return products
}

/**
 * Basic HTML parsing for Shopee products (fallback)
 */
function parseShopeeHTMLBasic(html: string, limit: number): CrawledProduct[] {
  // This is a very basic implementation
  // In production, you'd want to use a proper HTML parser like cheerio or jsdom
  const products: CrawledProduct[] = []
  
  // Try to find product links and basic info
  // Shopee uses various patterns for product links
  const productLinkPatterns = [
    /href=["']\/product\/(\d+)\/(\d+)["']/g,
    /href=["']https:\/\/shopee\.vn\/product\/(\d+)\/(\d+)["']/g,
    /data-src=["']\/product\/(\d+)\/(\d+)["']/g,
    /\/product\/(\d+)\/(\d+)/g,
  ]
  
  const seen = new Set<string>()
  
  for (const pattern of productLinkPatterns) {
    const matches = [...html.matchAll(pattern)]
    
    for (const match of matches) {
      const shopId = match[1] || match[0]?.split('/')[2]
      const itemId = match[2] || match[0]?.split('/')[3]
      
      if (shopId && itemId) {
        const key = `${shopId}-${itemId}`
        
        if (!seen.has(key) && /^\d+$/.test(shopId) && /^\d+$/.test(itemId)) {
          seen.add(key)
          
          // Try to extract product name from nearby HTML
          // Look for data-name or title attributes near the link
          const linkIndex = match.index || 0
          const context = html.substring(Math.max(0, linkIndex - 500), Math.min(html.length, linkIndex + 500))
          const nameMatch = context.match(/data-name=["']([^"']+)["']|title=["']([^"']+)["']|aria-label=["']([^"']+)["']/)
          const productName = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3]) : `Product ${itemId}`
          
          // Try to extract price
          const priceMatch = context.match(/data-price=["']?(\d+)["']?|price["']?\s*:\s*["']?(\d+)/i)
          const price = priceMatch ? parseInt(priceMatch[1] || priceMatch[2] || '0') / 100000 : 0
          
          products.push({
            name: productName,
            price: price,
            images: [],
            sku: itemId,
            url: `https://shopee.vn/product/${shopId}/${itemId}`,
          })
          
          if (products.length >= limit) {
            break
          }
        }
      }
    }
    
    if (products.length >= limit) {
      break
    }
  }
  
  console.log(`Extracted ${products.length} products from HTML links`)
  return products
}

/**
 * Map Shopee item to CrawledProduct format
 */
function mapShopeeItemToProduct(item: any): CrawledProduct {
  const itemBasic = item.item_basic || item || {}
  
  return {
    name: itemBasic.name || itemBasic.title || '',
    description: itemBasic.description || '',
    price: itemBasic.price ? itemBasic.price / 100000 : (itemBasic.price_min || 0),
    comparePrice: itemBasic.price_before_discount ? itemBasic.price_before_discount / 100000 : undefined,
    images: itemBasic.images ? itemBasic.images.map((img: string) => `https://cf.shopee.vn/file/${img}`) : [],
    sku: itemBasic.itemid?.toString() || itemBasic.item_id?.toString() || itemBasic.id?.toString() || '',
    url: itemBasic.itemid ? `https://shopee.vn/product/${itemBasic.shopid || ''}/${itemBasic.itemid}` : '',
  }
}

/**
 * Crawl products from Shopee for a specific category ID (internal function)
 * This is called recursively for subcategories
 * Now uses multiple fallback methods since API is blocked
 */
async function crawlShopeeForCategoryId(categoryId: string, limit: number, categoryInfo?: { catid: string; display_name: string; children?: any[] }): Promise<CrawledProduct[]> {
  console.log(`Crawling Shopee: categoryId="${categoryId}", limit=${limit}`)
  
  // Method 1: Try search API with category name (might not be blocked)
  if (categoryInfo?.display_name) {
    console.log(`Method 1: Trying search API with category name "${categoryInfo.display_name}"...`)
    const searchProducts = await crawlShopeeBySearch(categoryInfo.display_name, limit)
    if (searchProducts.length > 0) {
      console.log(`✓ Successfully crawled ${searchProducts.length} products using search API`)
      return searchProducts
    }
  }
  
  // Method 2: Try HTML parsing (since API is blocked)
  console.log(`Method 2: Attempting HTML parsing from category page...`)
  const htmlProducts = await parseShopeeHTML(categoryId, limit)
  
  if (htmlProducts.length > 0) {
    console.log(`✓ Successfully crawled ${htmlProducts.length} products using HTML parsing`)
    return htmlProducts
  }
  
  // Method 3: Fallback to API (may still be blocked, but worth trying)
  console.log(`Method 3: HTML parsing returned no products, trying API as last resort...`)
  
  // Reduce limit per request to avoid rate limiting
  const itemsPerRequest = Math.min(limit, 20) // Reduced from 60 to 20
  const maxRequests = Math.ceil(limit / itemsPerRequest)
  const allItems: any[] = []

  try {
    // Add initial delay
    await sleep(Math.random() * 2000 + 1000) // Random delay between 1-3 seconds

    for (let page = 0; page < maxRequests && allItems.length < limit; page++) {
      const offset = page * itemsPerRequest
      const currentLimit = Math.min(itemsPerRequest, limit - allItems.length)

      try {
        const products = await retryWithBackoff(async () => {
          // Try multiple API endpoint formats
          // Note: Shopee API endpoints may change frequently
          // Based on Shopee's actual API structure, try these endpoints:
          const endpoints = [
            // Format 1: Standard search API with categoryids (most common) - use newest for pagination
            `https://shopee.vn/api/v4/search/search_items?by=relevancy&categoryids=${categoryId}&limit=${currentLimit}&newest=${offset}&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`,
            // Format 2: Category page scenario - this is what category pages use
            `https://shopee.vn/api/v4/search/search_items?by=relevancy&categoryids=${categoryId}&limit=${currentLimit}&newest=${offset}&order=desc&page_type=search&scenario=PAGE_CATEGORY&version=2`,
            // Format 3: Try with match_id (sometimes used for categories)
            `https://shopee.vn/api/v4/search/search_items?by=relevancy&match_id=${categoryId}&limit=${currentLimit}&newest=${offset}&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`,
            // Format 4: Simplified version
            `https://shopee.vn/api/v4/search/search_items?by=relevancy&categoryids=${categoryId}&limit=${currentLimit}&newest=${offset}&order=desc&version=2`,
            // Format 5: Try with catid parameter (different from categoryids)
            `https://shopee.vn/api/v4/search/search_items?by=relevancy&catid=${categoryId}&limit=${currentLimit}&newest=${offset}&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`,
            // Format 6: Category feed/recommend API
            `https://shopee.vn/api/v4/recommend/recommend?bundle=category_landing_page&cat_level=1&catid=${categoryId}&limit=${currentLimit}&offset=${offset}`,
          ]
          
          // Add random delay between requests
          if (page > 0) {
            await sleep(Math.random() * 3000 + 2000) // 2-5 seconds delay
          }

          let lastError: any = null
          
          // Try each endpoint until one works
          for (let i = 0; i < endpoints.length; i++) {
            const url = endpoints[i]
            console.log(`Fetching Shopee page ${page + 1}, endpoint ${i + 1}/${endpoints.length}: ${url.substring(0, 100)}...`)
            
            try {
              // Different referer based on endpoint type
              // Shopee category pages use format: https://shopee.vn/cat.{catid}
              let referer = `https://shopee.vn/`
              if (url.includes('categoryids') || url.includes('catid') || url.includes('cat_level')) {
                referer = `https://shopee.vn/cat.${categoryId}`
              } else if (url.includes('match_id')) {
                referer = `https://shopee.vn/search?category=${categoryId}`
              } else {
                referer = `https://shopee.vn/`
              }
              
              const response = await fetch(url, {
                headers: {
                  'User-Agent': getRandomUserAgent(),
                  'Referer': referer,
                  'Accept': 'application/json, text/plain, */*',
                  'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                  'Accept-Encoding': 'gzip, deflate, br',
                  'Connection': 'keep-alive',
                  'Sec-Fetch-Dest': 'empty',
                  'Sec-Fetch-Mode': 'cors',
                  'Sec-Fetch-Site': 'same-origin',
                  'Origin': 'https://shopee.vn',
                  'X-Requested-With': 'XMLHttpRequest',
                  'If-None-Match-': '*',
                },
                signal: AbortSignal.timeout(45000),
              })

              console.log(`Shopee API response status: ${response.status} (endpoint ${i + 1})`)

              if (!response.ok) {
                const responseText = await response.text().catch(() => '')
                console.error(`Shopee API error ${response.status} (endpoint ${i + 1}):`, responseText.substring(0, 200))
                
                if (response.status === 403 || response.status === 429) {
                  const retryAfter = response.headers.get('Retry-After')
                  lastError = new Error(retryAfter 
                    ? `Shopee API rate limited. Please wait ${retryAfter} seconds before retrying.`
                    : 'Shopee API rate limited. Please try again later or reduce the limit.')
                  continue // Try next endpoint
                }
                
                // For other errors, try next endpoint
                try {
                  const errorData = JSON.parse(responseText)
                  lastError = new Error(`Shopee API returned ${response.status}: ${errorData.message || response.statusText}`)
                } catch {
                  lastError = new Error(`Shopee API returned ${response.status}: ${response.statusText}`)
                }
                continue
              }

              const data = await response.json()
              console.log(`Shopee API response (endpoint ${i + 1}):`, {
                status: response.status,
                hasItems: !!data.items,
                itemsCount: data.items?.length || 0,
                hasData: !!data.data,
                dataCount: Array.isArray(data.data) ? data.data.length : 'not array',
                total: data.total_count || data.total || data.total_count_before_filters || 'unknown',
                keys: Object.keys(data),
                error: data.error,
                error_msg: data.error_msg,
                warning: data.warning,
              })
              
              // Log full response in development
              if (process.env.NODE_ENV === 'development') {
                console.log('Full response data:', JSON.stringify(data, null, 2).substring(0, 1000))
              }
              
              // Check if we have items
              if (data.items && Array.isArray(data.items) && data.items.length > 0) {
                console.log(`✓ Found ${data.items.length} items in data.items`)
                return data.items
              }
              
              // Check for alternative response structures
              if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                console.log(`✓ Found ${data.data.length} items in data.data`)
                return data.data
              }
              
              // Check for items in various nested structures
              if (data.modules && Array.isArray(data.modules)) {
                const items: any[] = []
                data.modules.forEach((module: any, idx: number) => {
                  if (module.items && Array.isArray(module.items)) {
                    items.push(...module.items)
                  }
                  if (module.data && Array.isArray(module.data)) {
                    items.push(...module.data)
                  }
                  // Check for common module types
                  if (module.module_name === 'search_result' && module.items) {
                    items.push(...module.items)
                  }
                })
                if (items.length > 0) {
                  console.log(`✓ Found ${items.length} items in modules`)
                  return items
                }
              }
              
              // Check for error or empty response
              if (data.error || data.error_msg) {
                console.error(`Shopee API error: ${data.error || data.error_msg}`)
                if (data.error_msg?.includes('category') || data.error_msg?.includes('not found') || data.error_msg?.includes('invalid')) {
                  // Don't throw immediately, try next endpoint
                  lastError = new Error(`Category ${categoryId} not found or invalid: ${data.error_msg}`)
                  if (i < endpoints.length - 1) {
                    console.log('Category error, trying next endpoint...')
                    continue
                  }
                }
              }
              
              // Check if response indicates no results (but response is valid)
              const totalCount = data.total_count || data.total || data.total_count_before_filters || 0
              if (totalCount === 0 && (!data.items || data.items.length === 0)) {
                console.warn(`Response indicates 0 total items for category ${categoryId}`)
                // This might be a valid response (category exists but no products)
                // Try next endpoint to be sure
                if (i < endpoints.length - 1) {
                  console.log('Empty results, trying next endpoint...')
                  continue
                }
                // If all endpoints return empty, category might actually be empty or invalid
                return []
              }
              
              // If we have a total count > 0 but no items, something is wrong with the response structure
              if (totalCount > 0 && (!data.items || data.items.length === 0)) {
                console.warn(`Total count is ${totalCount} but no items found. Response structure might be different.`)
                console.log('Trying to find items in alternative locations...')
                // Already checked modules above, so if we get here, structure is unexpected
                if (i < endpoints.length - 1) {
                  continue
                }
              }
              
              console.warn(`No items in response for category ${categoryId}, endpoint ${i + 1}`)
              console.log('Response structure:', {
                keys: Object.keys(data),
                itemsType: typeof data.items,
                itemsLength: Array.isArray(data.items) ? data.items.length : 'not array',
                dataType: typeof data.data,
                modulesType: typeof data.modules,
                modulesLength: Array.isArray(data.modules) ? data.modules.length : 'not array',
              })
              
              if (i < endpoints.length - 1) {
                console.log('Trying next endpoint...')
                continue
              }
              
              // Last endpoint, return empty
              return []
            } catch (fetchError: any) {
              console.error(`Error with endpoint ${i + 1}:`, fetchError.message)
              lastError = fetchError
              if (i < endpoints.length - 1) {
                continue // Try next endpoint
              }
            }
          }
          
          // All endpoints failed
          if (lastError) {
            throw lastError
          }
          
          return []
        }, 2, 2000) // Reduced retries since we're trying multiple endpoints

        allItems.push(...products)

        // If we got fewer items than requested, we've reached the end
        if (products.length < currentLimit) {
          break
        }
      } catch (error: any) {
        console.error(`Error crawling Shopee page ${page + 1}:`, error.message)
        
        // If rate limited, stop and return what we have
        if (error.message?.includes('rate limited') || error.message?.includes('rate limit')) {
          if (allItems.length > 0) {
            console.warn(`Rate limited after fetching ${allItems.length} items. Returning partial results.`)
            break
          }
          // Don't throw error, return empty array and let the caller handle it
          console.warn('Rate limited on first request, returning empty array')
          break
        }
        
        // For other errors on first page, throw
        if (page === 0) {
          throw error
        }
        
        // For subsequent pages, continue with what we have
        break
      }
    }

    if (allItems.length === 0) {
      console.warn(`No items found for category ${categoryId} on Shopee after trying ${maxRequests} requests`)
      console.log(`Category info available:`, categoryInfo ? 'Yes' : 'No')
      console.log(`Category info:`, categoryInfo ? {
        catid: categoryInfo.catid,
        display_name: categoryInfo.display_name,
        hasChildren: !!categoryInfo.children,
        childrenCount: categoryInfo.children?.length || 0,
      } : 'N/A')
      
      // If this is a parent category (level 1), try crawling from subcategories
      if (categoryInfo?.children && Array.isArray(categoryInfo.children) && categoryInfo.children.length > 0) {
        console.log(`⚠️ Parent category has no products. Trying to crawl from ${categoryInfo.children.length} subcategories...`)
        console.log(`First few subcategories:`, categoryInfo.children.slice(0, 3).map((c: any) => ({
          catid: c.catid,
          display_name: c.display_name || c.name,
        })))
        
        const subcategoryItems: any[] = []
        // Calculate items per subcategory - distribute limit across subcategories
        // Use at least 3 items per subcategory to ensure we get results
        const maxSubcategories = Math.min(categoryInfo.children.length, Math.max(5, Math.floor(limit / 3)))
        const itemsPerSubcategory = Math.max(3, Math.floor(limit / maxSubcategories))
        const subcategoriesToCrawl = categoryInfo.children.slice(0, maxSubcategories)
        
        console.log(`Crawling ${subcategoriesToCrawl.length} subcategories (limited to avoid rate limiting, ${itemsPerSubcategory} items each, target total: ${limit})...`)
        
        for (let i = 0; i < subcategoriesToCrawl.length && subcategoryItems.length < limit; i++) {
          const subcat = subcategoriesToCrawl[i]
          const subcatId = subcat.catid?.toString() || subcat.catid
          const subcatName = subcat.display_name || subcat.name || `Subcategory ${i + 1}`
          
          if (!subcatId || !/^\d+$/.test(subcatId)) {
            console.warn(`Skipping invalid subcategory: ${subcatName} (invalid ID: ${subcatId})`)
            continue
          }
          
          console.log(`[${i + 1}/${subcategoriesToCrawl.length}] Crawling subcategory: ${subcatName} (ID: ${subcatId})`)
          
          try {
            // Add delay between subcategory requests to avoid rate limiting
            if (i > 0) {
              const delay = Math.random() * 2000 + 1500 // 1.5-3.5 seconds
              console.log(`Waiting ${Math.round(delay)}ms before next subcategory...`)
              await sleep(delay)
            }
            
            // Create subcategory info object (without children to avoid recursion)
            const subcatInfo = {
              catid: subcatId,
              display_name: subcatName,
              children: [], // Don't crawl grandchildren
            }
            
            // Recursively call crawlShopeeForCategoryId with subcategory
            const subcatProducts = await crawlShopeeForCategoryId(subcatId, itemsPerSubcategory, subcatInfo)
            
            if (subcatProducts && Array.isArray(subcatProducts) && subcatProducts.length > 0) {
              console.log(`✓ Found ${subcatProducts.length} products in subcategory "${subcatName}"`)
              subcategoryItems.push(...subcatProducts)
              
              // Update category name to parent category for all products
              subcatProducts.forEach((product: any) => {
                if (categoryInfo.display_name) {
                  product.category = categoryInfo.display_name
                }
              })
            } else {
              console.log(`✗ No products found in subcategory "${subcatName}" (ID: ${subcatId})`)
            }
            
            // Stop if we have enough items
            if (subcategoryItems.length >= limit) {
              console.log(`Reached target limit of ${limit} products. Stopping subcategory crawl.`)
              break
            }
          } catch (error: any) {
            console.error(`Error crawling subcategory "${subcatName}" (ID: ${subcatId}):`, error.message)
            console.error(`Error stack:`, error.stack)
            // Continue with next subcategory instead of failing completely
          }
        }
        
        if (subcategoryItems.length > 0) {
          console.log(`✓ Successfully crawled ${subcategoryItems.length} products from ${subcategoriesToCrawl.length} subcategories`)
          allItems.push(...subcategoryItems.slice(0, limit))
        } else {
          console.warn(`✗ No products found in any of the ${subcategoriesToCrawl.length} subcategories tried`)
          console.warn(`This could mean:`)
          console.warn(`  1. Shopee API has changed or requires authentication`)
          console.warn(`  2. All subcategories are empty or invalid`)
          console.warn(`  3. Shopee is blocking requests (rate limiting, bot detection)`)
          console.warn(`  4. All API endpoints are no longer working`)
          console.warn(`  5. Shopee requires cookies/session or different API format`)
        }
      } else {
        if (!categoryInfo) {
          console.warn(`⚠️ Category info not available. Cannot crawl from subcategories.`)
          console.warn(`This might be because:`)
          console.warn(`  - Category API failed to fetch`)
          console.warn(`  - Category slug "${categoryId}" is not found in Shopee API`)
          console.warn(`  - Using static mapping which doesn't include children`)
        } else if (!categoryInfo.children || categoryInfo.children.length === 0) {
          console.warn(`⚠️ Category has no subcategories or is a leaf category`)
        }
        
        console.warn(`This could mean:`)
        console.warn(`  1. Shopee API has changed or requires authentication`)
        console.warn(`  2. Category ID ${categoryId} is invalid or no longer exists`)
        console.warn(`  3. Shopee is blocking requests (rate limiting, bot detection)`)
        console.warn(`  4. All API endpoints are no longer working`)
        console.warn(`  5. Category is a leaf category with no products`)
      }
      
      // If still no items, return empty array
      if (allItems.length === 0) {
        console.error(`❌ Final result: No products found after trying parent category and subcategories`)
        return []
      }
    }

    console.log(`Successfully crawled ${allItems.length} items from Shopee`)

    const mappedProducts = allItems.slice(0, limit).map((item: any) => {
      const itemBasic = item.item_basic || {}
      const price = itemBasic.price ? itemBasic.price / 100000 : 0
      const priceBeforeDiscount = itemBasic.price_before_discount ? itemBasic.price_before_discount / 100000 : undefined

      const product = {
        name: itemBasic.name || '',
        description: itemBasic.description || '',
        price: price,
        comparePrice: priceBeforeDiscount && priceBeforeDiscount > price ? priceBeforeDiscount : undefined,
        images: itemBasic.images ? itemBasic.images.map((img: string) => `https://cf.shopee.vn/file/${img}`) : [],
        category: categoryInfo?.display_name || categoryId, // Use display name if available, fallback to categoryId
        sku: itemBasic.itemid?.toString() || itemBasic.item_id?.toString() || '',
        url: `https://shopee.vn/product/${itemBasic.shopid}/${itemBasic.itemid}`,
      }
      
      if (!product.name) {
        console.warn('Product without name:', itemBasic)
      }
      
      return product
    })
    
    console.log(`Mapped ${mappedProducts.length} products from ${allItems.length} items`)
    if (mappedProducts.length > 0) {
      console.log('Sample mapped product:', JSON.stringify(mappedProducts[0], null, 2))
    }
    
    return mappedProducts
  } catch (error: any) {
    console.error('Error crawling Shopee:', error)
    if (error.name === 'AbortError') {
      console.warn('Request timeout, returning empty array')
      return []
    }
    // For rate limit errors, return empty array instead of throwing
    if (error.message?.includes('rate limited') || error.message?.includes('rate limit')) {
      console.warn('Rate limited, returning empty array')
      return []
    }
    // For other errors, still throw to be handled by caller
    throw error
  }
}

/**
 * Crawl products from Lazada (using search API)
 */
async function crawlLazada(options: CrawlOptions): Promise<CrawledProduct[]> {
  const { category, limit } = options
  const categoryId = categoryMapping.lazada[category] || category

  try {
    // Lazada search API
    const url = `https://www.lazada.vn/catalog/?ajax=true&from=search_history&page=1&q=${encodeURIComponent(category)}&spm=a2o4n.searchlistcategory.search.1`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Lazada API returned ${response.status}`)
    }

    // Note: Lazada's API structure may vary, this is a simplified version
    // In production, you may need to parse HTML or use their official API
    const text = await response.text()
    
    // Try to extract JSON from response
    const jsonMatch = text.match(/window\.pageData\s*=\s*({.*?});/s)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[1])
      const items = data.mods?.listItems || []
      
      return items.slice(0, limit).map((item: any) => ({
        name: item.name || '',
        price: item.price || 0,
        comparePrice: item.originalPrice || undefined,
        images: item.image ? [item.image] : [],
        category: category,
        url: item.productUrl || '',
      }))
    }

    return []
  } catch (error) {
    console.error('Error crawling Lazada:', error)
    // Return empty array instead of throwing to allow other platforms to work
    return []
  }
}

/**
 * Crawl products from Tiki
 * Uses Tiki's public API
 */
async function crawlTiki(options: CrawlOptions): Promise<CrawledProduct[]> {
  const { category, limit } = options
  const categoryId = categoryMapping.tiki[category] || category

  try {
    // Tiki category API
    // Note: Tiki API structure may vary, this is a simplified version
    const url = `https://tiki.vn/api/v2/products?category=${categoryId}&limit=${Math.min(limit, 48)}&page=1`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'vi-VN,vi;q=0.9',
        'Referer': 'https://tiki.vn/',
      },
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error('Tiki API rate limited. Please try again later.')
      }
      throw new Error(`Tiki API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const items = data.data || []

    if (items.length === 0) {
      console.warn(`No items found for category ${categoryId} on Tiki`)
      return []
    }

    return items.slice(0, limit).map((item: any) => ({
      name: item.name || '',
      description: item.short_description || item.description || '',
      price: item.price || 0,
      comparePrice: item.list_price && item.list_price > item.price ? item.list_price : undefined,
      images: item.images ? item.images.map((img: any) => img.large_url || img.base_url || '').filter(Boolean) : [],
      category: category,
      sku: item.sku?.toString() || item.id?.toString() || '',
      url: item.url_path ? `https://tiki.vn${item.url_path}` : item.url || '',
    }))
  } catch (error: any) {
    console.error('Error crawling Tiki:', error)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again with a smaller limit.')
    }
    throw error
  }
}

/**
 * Crawl products from Sendo
 */
async function crawlSendo(options: CrawlOptions): Promise<CrawledProduct[]> {
  const { category, limit } = options

  try {
    // Sendo search API (example - may need adjustment)
    const url = `https://www.sendo.vn/m/wap_v2/full/san-pham?category_id=${category}&p=1&limit=${Math.min(limit, 40)}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Sendo API returned ${response.status}`)
    }

    const data = await response.json()
    const items = data.result?.data || []

    return items.slice(0, limit).map((item: any) => ({
      name: item.name || '',
      price: item.price || 0,
      comparePrice: item.original_price || undefined,
      images: item.image ? [item.image] : [],
      category: category,
      url: item.url || '',
    }))
  } catch (error) {
    console.error('Error crawling Sendo:', error)
    return []
  }
}

/**
 * Main crawl function
 */
export async function crawlCategory(options: CrawlOptions): Promise<{
  category: string
  platform: string
  total: number
  products: CrawledProduct[]
  errors?: string[]
}> {
  const { platform, category, limit } = options
  const errors: string[] = []
  let products: CrawledProduct[] = []

  // Validate limit - suggest smaller limit if too large
  if (limit > 100) {
    errors.push(`Số lượng sản phẩm lớn (${limit}) có thể gặp rate limiting. Khuyến nghị: ≤ 50 sản phẩm.`)
  }

  try {
    switch (platform) {
      case 'shopee':
        try {
          products = await crawlShopee(options)
          console.log(`Shopee crawl completed: ${products.length} products`)
        } catch (error: any) {
          console.error('Shopee crawl error:', error.message)
          if (error.message?.includes('rate limited') || error.message?.includes('rate limit')) {
            errors.push(`Shopee API bị rate limit: ${error.message}`)
            errors.push('💡 Gợi ý: Thử lại sau 5-10 phút, giảm số lượng sản phẩm, hoặc thử nền tảng khác (Tiki, Lazada).')
            // Don't throw, return empty products array with errors
            products = []
          } else {
            // For other errors, still throw to be caught by outer catch
            throw error
          }
        }
        break
      case 'lazada':
        products = await crawlLazada(options)
        if (products.length === 0) {
          errors.push('Lazada crawling may require additional setup')
        }
        break
      case 'tiki':
        products = await crawlTiki(options)
        if (products.length === 0) {
          errors.push('Tiki crawling may require additional setup')
        }
        break
      case 'sendo':
        products = await crawlSendo(options)
        if (products.length === 0) {
          errors.push('Sendo crawling may require additional setup')
        }
        break
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }

    // Log result before returning
    console.log(`CrawlCategory result: ${products.length} products, ${errors.length} errors`)
    if (products.length > 0) {
      console.log('Sample product:', JSON.stringify(products[0], null, 2))
    } else {
      console.warn(`⚠️ No products found for category "${category}" on ${platform}`)
      if (platform === 'shopee') {
        console.warn(`  Category ID used: ${categoryMapping.shopee[category] || category}`)
        console.warn(`  Possible issues:`)
        console.warn(`    1. Shopee API may have changed or requires authentication`)
        console.warn(`    2. Category ID may be invalid`)
        console.warn(`    3. Shopee may be blocking requests`)
        console.warn(`  💡 Try: Test the API endpoint directly at /api/test/shopee-category?categoryId=${categoryMapping.shopee[category] || category}`)
      }
    }

    // Always return result, even if empty
    // Don't add errors if we have products or if errors already exist
    let defaultError: string[] = []
    if (products.length === 0 && errors.length === 0) {
      if (platform === 'shopee') {
        defaultError = [
          `Không tìm thấy sản phẩm nào cho danh mục "${category}" trên Shopee.`,
          `Category ID: ${categoryMapping.shopee[category] || category}`,
          ``,
          `Nguyên nhân có thể:`,
          `• Shopee API đã thay đổi hoặc yêu cầu xác thực`,
          `• Category ID không còn hợp lệ`,
          `• Shopee đang chặn requests (rate limit, bot detection)`,
          ``,
          `💡 Gợi ý:`,
          `• Thử lại sau vài phút`,
          `• Thử nền tảng khác (Tiki, Lazada)`,
          `• Kiểm tra API: /api/test/shopee-category?categoryId=${categoryMapping.shopee[category] || category}`,
        ]
      } else {
        defaultError = [`Không tìm thấy sản phẩm nào cho danh mục "${category}" trên ${platform}`]
      }
    }
    
    const result = {
      category,
      platform,
      total: products.length,
      products: products.slice(0, limit),
      errors: errors.length > 0 ? errors : (defaultError.length > 0 ? defaultError : undefined),
    }

    console.log('Returning crawl result:', {
      category: result.category,
      platform: result.platform,
      total: result.total,
      productsCount: result.products.length,
      errorsCount: result.errors?.length || 0,
    })

    return result
  } catch (error: any) {
    console.error('Crawl error:', error)
    
    // Provide helpful error messages
    if (error.message?.includes('rate limited')) {
      throw new Error(
        `⚠️ ${platform} API bị rate limit.\n\n` +
        `💡 Gợi ý:\n` +
        `- Thử lại sau 5-10 phút\n` +
        `- Giảm số lượng sản phẩm (khuyến nghị: ≤ 20-30 sản phẩm)\n` +
        `- Thử nền tảng khác (Tiki, Lazada)\n` +
        `- Chia nhỏ requests thành nhiều lần`
      )
    }
    
    throw new Error(`Failed to crawl ${platform}: ${error.message}`)
  }
}
