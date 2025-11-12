/**
 * Utility functions for category mapping and validation
 */

/**
 * Get Shopee category ID from slug
 */
export function getShopeeCategoryId(slug: string): string | null {
  const categoryMapping: Record<string, string> = {
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
  }

  // Direct lookup
  if (categoryMapping[slug]) {
    return categoryMapping[slug]
  }

  // Check if slug is already a numeric ID
  if (/^\d+$/.test(slug)) {
    return slug
  }

  // Try case-insensitive partial match
  const normalizedSlug = slug.toLowerCase().trim()
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (key.toLowerCase() === normalizedSlug || 
        key.toLowerCase().includes(normalizedSlug) ||
        normalizedSlug.includes(key.toLowerCase())) {
      return value
    }
  }

  // Try to match by removing special characters
  const slugWithoutSpecial = normalizedSlug.replace(/[^a-z0-9]/g, '')
  for (const [key, value] of Object.entries(categoryMapping)) {
    const keyWithoutSpecial = key.replace(/[^a-z0-9]/g, '')
    if (keyWithoutSpecial === slugWithoutSpecial) {
      return value
    }
  }

  return null
}

/**
 * Validate if a category slug exists in mapping
 */
export function validateCategorySlug(slug: string, platform: 'shopee' | 'lazada' | 'tiki' | 'sendo'): boolean {
  const mappings: Record<string, Record<string, string>> = {
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

  return !!mappings[platform]?.[slug] || /^\d+$/.test(slug)
}

/**
 * Get all available category slugs for a platform
 */
export function getAvailableCategorySlugs(platform: 'shopee' | 'lazada' | 'tiki' | 'sendo'): string[] {
  const mappings: Record<string, Record<string, string>> = {
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

  return Object.keys(mappings[platform] || {})
}
