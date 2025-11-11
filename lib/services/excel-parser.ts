/**
 * Excel Parser Service
 * Parses Excel files and converts them to product data
 */

import * as XLSX from 'xlsx'

export interface ExcelProductRow {
  STT?: number
  'Tên sản phẩm': string
  'Mô tả'?: string
  'Giá': number
  'Giá so sánh'?: number
  'Danh mục': string
  'SKU'?: string
  'Hình ảnh'?: string
  'Kích thước'?: string
  'Màu sắc'?: string
  'Giá variant'?: string
  'Số lượng'?: string
  'Số lượng tổng'?: number
  'Trạng thái'?: string
}

export interface ParsedProduct {
  name: string
  description?: string
  price: number
  comparePrice?: number
  category: string
  sku?: string
  images: string[]
  variants?: Array<{
    size?: string
    color?: string
    price?: number
    stock?: number
  }>
  quantity?: number
  status?: string
}

export interface ParseResult {
  products: ParsedProduct[]
  errors: string[]
}

/**
 * Parse Excel file and extract products
 */
export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const errors: string[] = []
    const products: ParsedProduct[] = []

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        
        // Get first worksheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to JSON
        const rows: ExcelProductRow[] = XLSX.utils.sheet_to_json(worksheet)

        if (rows.length === 0) {
          errors.push('File Excel không có dữ liệu')
          resolve({ products, errors })
          return
        }

        // Parse each row
        rows.forEach((row, index) => {
          try {
            const rowNumber = index + 2 // +2 because index starts at 0 and Excel row 1 is header

            // Validate required fields
            if (!row['Tên sản phẩm']) {
              errors.push(`Dòng ${rowNumber}: Thiếu tên sản phẩm`)
              return
            }

            if (!row['Giá'] || isNaN(Number(row['Giá']))) {
              errors.push(`Dòng ${rowNumber}: Giá không hợp lệ`)
              return
            }

            if (!row['Danh mục']) {
              errors.push(`Dòng ${rowNumber}: Thiếu danh mục`)
              return
            }

            // Parse images
            const images: string[] = []
            if (row['Hình ảnh']) {
              const imageUrls = row['Hình ảnh']
                .split(',')
                .map((url: string) => url.trim())
                .filter((url: string) => url.length > 0)
              images.push(...imageUrls)
            }

            // Parse variants
            const variants: ParsedProduct['variants'] = []
            const sizes = row['Kích thước'] ? row['Kích thước'].split(',').map((s: string) => s.trim()).filter(Boolean) : []
            const colors = row['Màu sắc'] ? row['Màu sắc'].split(',').map((c: string) => c.trim()).filter(Boolean) : []
            const variantPrices = row['Giá variant'] ? row['Giá variant'].split(',').map((p: string) => parseFloat(p.trim())).filter((p: number) => !isNaN(p)) : []
            const variantStocks = row['Số lượng'] ? row['Số lượng'].split(',').map((s: string) => parseInt(s.trim())).filter((s: number) => !isNaN(s)) : []

            // Create variants if sizes or colors are provided
            if (sizes.length > 0 || colors.length > 0) {
              const maxLength = Math.max(sizes.length, colors.length, variantPrices.length, variantStocks.length)
              
              for (let i = 0; i < maxLength; i++) {
                variants.push({
                  size: sizes[i] || undefined,
                  color: colors[i] || undefined,
                  price: variantPrices[i] || undefined,
                  stock: variantStocks[i] || undefined,
                })
              }
            }

            // Parse product
            const product: ParsedProduct = {
              name: row['Tên sản phẩm'].trim(),
              description: row['Mô tả']?.trim() || undefined,
              price: parseFloat(row['Giá'].toString()),
              comparePrice: row['Giá so sánh'] ? parseFloat(row['Giá so sánh'].toString()) : undefined,
              category: row['Danh mục'].trim(),
              sku: row['SKU']?.trim() || undefined,
              images,
              variants: variants.length > 0 ? variants : undefined,
              quantity: row['Số lượng tổng'] ? parseInt(row['Số lượng tổng'].toString()) : (variantStocks.length > 0 ? variantStocks.reduce((a, b) => a + b, 0) : undefined),
              status: row['Trạng thái']?.trim() || 'active',
            }

            // Validate price
            if (product.price <= 0) {
              errors.push(`Dòng ${rowNumber}: Giá phải lớn hơn 0`)
              return
            }

            // Validate compare price
            if (product.comparePrice && product.comparePrice <= product.price) {
              errors.push(`Dòng ${rowNumber}: Giá so sánh phải lớn hơn giá`)
              return
            }

            products.push(product)
          } catch (error: any) {
            errors.push(`Dòng ${index + 2}: Lỗi khi parse - ${error.message}`)
          }
        })

        resolve({ products, errors })
      } catch (error: any) {
        reject(new Error(`Lỗi khi đọc file Excel: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Lỗi khi đọc file'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * Parse Excel file from buffer (server-side)
 */
export function parseExcelBuffer(buffer: Buffer): ParseResult {
  const errors: string[] = []
  const products: ParsedProduct[] = []

  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    
    // Get first worksheet
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    
    // Convert to JSON
    const rows: ExcelProductRow[] = XLSX.utils.sheet_to_json(worksheet)

    if (rows.length === 0) {
      errors.push('File Excel không có dữ liệu')
      return { products, errors }
    }

    // Parse each row
    rows.forEach((row, index) => {
      try {
        const rowNumber = index + 2

        // Validate required fields
        if (!row['Tên sản phẩm']) {
          errors.push(`Dòng ${rowNumber}: Thiếu tên sản phẩm`)
          return
        }

        if (!row['Giá'] || isNaN(Number(row['Giá']))) {
          errors.push(`Dòng ${rowNumber}: Giá không hợp lệ`)
          return
        }

        if (!row['Danh mục']) {
          errors.push(`Dòng ${rowNumber}: Thiếu danh mục`)
          return
        }

        // Parse images
        const images: string[] = []
        if (row['Hình ảnh']) {
          const imageUrls = row['Hình ảnh']
            .split(',')
            .map((url: string) => url.trim())
            .filter((url: string) => url.length > 0)
          images.push(...imageUrls)
        }

        // Parse variants
        const variants: ParsedProduct['variants'] = []
        const sizes = row['Kích thước'] ? row['Kích thước'].split(',').map((s: string) => s.trim()).filter(Boolean) : []
        const colors = row['Màu sắc'] ? row['Màu sắc'].split(',').map((c: string) => c.trim()).filter(Boolean) : []
        const variantPrices = row['Giá variant'] ? row['Giá variant'].split(',').map((p: string) => parseFloat(p.trim())).filter((p: number) => !isNaN(p)) : []
        const variantStocks = row['Số lượng'] ? row['Số lượng'].split(',').map((s: string) => parseInt(s.trim())).filter((s: number) => !isNaN(s)) : []

        if (sizes.length > 0 || colors.length > 0) {
          const maxLength = Math.max(sizes.length, colors.length, variantPrices.length, variantStocks.length)
          
          for (let i = 0; i < maxLength; i++) {
            variants.push({
              size: sizes[i] || undefined,
              color: colors[i] || undefined,
              price: variantPrices[i] || undefined,
              stock: variantStocks[i] || undefined,
            })
          }
        }

        const product: ParsedProduct = {
          name: row['Tên sản phẩm'].trim(),
          description: row['Mô tả']?.trim() || undefined,
          price: parseFloat(row['Giá'].toString()),
          comparePrice: row['Giá so sánh'] ? parseFloat(row['Giá so sánh'].toString()) : undefined,
          category: row['Danh mục'].trim(),
          sku: row['SKU']?.trim() || undefined,
          images,
          variants: variants.length > 0 ? variants : undefined,
          quantity: row['Số lượng tổng'] ? parseInt(row['Số lượng tổng'].toString()) : (variantStocks.length > 0 ? variantStocks.reduce((a, b) => a + b, 0) : undefined),
          status: row['Trạng thái']?.trim() || 'active',
        }

        if (product.price <= 0) {
          errors.push(`Dòng ${rowNumber}: Giá phải lớn hơn 0`)
          return
        }

        if (product.comparePrice && product.comparePrice <= product.price) {
          errors.push(`Dòng ${rowNumber}: Giá so sánh phải lớn hơn giá`)
          return
        }

        products.push(product)
      } catch (error: any) {
        errors.push(`Dòng ${index + 2}: Lỗi khi parse - ${error.message}`)
      }
    })

    return { products, errors }
  } catch (error: any) {
    errors.push(`Lỗi khi đọc file Excel: ${error.message}`)
    return { products, errors }
  }
}





