import { ordersApi, Order } from '@/lib/api/orders'
import { productsApi, Product } from '@/lib/api/products'
import { sellerApi, SellerOverview } from '@/lib/api/seller'

export interface ReportData {
  overview?: SellerOverview
  orders?: Order[]
  products?: Product[]
}

export async function exportToExcel(data: ReportData, period: string): Promise<Blob> {
  // Dynamic import to reduce bundle size
  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()

  // Sheet 1: Tổng quan
  if (data.overview) {
    const overviewData = [
      ['BÁO CÁO TỔNG QUAN'],
      ['Kỳ báo cáo', period],
      [''],
      ['Chỉ số', 'Giá trị'],
      ['Doanh thu', `${data.overview.totalRevenue.toLocaleString('vi-VN')} ₫`],
      ['Thay đổi doanh thu', data.overview.revenueChange || '0%'],
      ['Đơn hàng mới', data.overview.newOrders],
      ['Thay đổi đơn hàng', data.overview.newOrdersChange || '0%'],
      ['Số sản phẩm', data.overview.productsCount],
      ['Thay đổi sản phẩm', data.overview.productsChange || '0%'],
      ['Lượt xem', data.overview.views],
      ['Thay đổi lượt xem', data.overview.viewsChange || '0%'],
    ]
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData)
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Tổng quan')
  }

  // Sheet 2: Đơn hàng
  if (data.orders && data.orders.length > 0) {
    const ordersData = [
      ['Mã đơn', 'Khách hàng', 'Trạng thái', 'Tổng tiền', 'Ngày tạo'],
      ...data.orders.map(order => [
        order.orderNumber,
        order.customerName,
        order.status,
        order.finalTotal.toLocaleString('vi-VN') + ' ₫',
        new Date(order.createdAt).toLocaleDateString('vi-VN'),
      ]),
    ]
    const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData)
    XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Đơn hàng')
  }

  // Sheet 3: Sản phẩm
  if (data.products && data.products.length > 0) {
    const productsData = [
      ['Tên sản phẩm', 'Giá', 'Số lượng', 'Trạng thái', 'Danh mục'],
      ...data.products.map(product => [
        product.name,
        product.price.toLocaleString('vi-VN') + ' ₫',
        product.quantity || 0,
        product.status || 'ACTIVE',
        product.categoryName || 'N/A',
      ]),
    ]
    const productsSheet = XLSX.utils.aoa_to_sheet(productsData)
    XLSX.utils.book_append_sheet(workbook, productsSheet, 'Sản phẩm')
  }

  // Convert to blob
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export async function exportToCSV(data: ReportData, period: string): Promise<Blob> {
  let csvContent = `BÁO CÁO - ${period}\n\n`

  if (data.overview) {
    csvContent += 'TỔNG QUAN\n'
    csvContent += `Doanh thu,${data.overview.totalRevenue}\n`
    csvContent += `Thay đổi doanh thu,${data.overview.revenueChange || '0%'}\n`
    csvContent += `Đơn hàng mới,${data.overview.newOrders}\n`
    csvContent += `Thay đổi đơn hàng,${data.overview.newOrdersChange || '0%'}\n`
    csvContent += `Số sản phẩm,${data.overview.productsCount}\n`
    csvContent += `Thay đổi sản phẩm,${data.overview.productsChange || '0%'}\n`
    csvContent += `Lượt xem,${data.overview.views}\n`
    csvContent += `Thay đổi lượt xem,${data.overview.viewsChange || '0%'}\n\n`
  }

  if (data.orders && data.orders.length > 0) {
    csvContent += 'ĐƠN HÀNG\n'
    csvContent += 'Mã đơn,Khách hàng,Trạng thái,Tổng tiền,Ngày tạo\n'
    data.orders.forEach(order => {
      csvContent += `${order.orderNumber},${order.customerName},${order.status},${order.finalTotal},${new Date(order.createdAt).toLocaleDateString('vi-VN')}\n`
    })
    csvContent += '\n'
  }

  if (data.products && data.products.length > 0) {
    csvContent += 'SẢN PHẨM\n'
    csvContent += 'Tên sản phẩm,Giá,Số lượng,Trạng thái,Danh mục\n'
    data.products.forEach(product => {
      csvContent += `${product.name},${product.price},${product.quantity || 0},${product.status || 'ACTIVE'},${product.categoryName || 'N/A'}\n`
    })
  }

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
}

export async function fetchReportData(period: '7days' | '30days' | '90days' | 'year'): Promise<ReportData> {
  const data: ReportData = {}

  try {
    // Fetch overview
    const overviewResp = await sellerApi.getOverview()
    if (overviewResp.success && overviewResp.data) {
      data.overview = overviewResp.data
    }
  } catch (error) {
    console.error('Failed to fetch overview:', error)
  }

  try {
    // Fetch orders (last 100 orders)
    const ordersResp = await ordersApi.getSellerOrders(0, 100)
    if (ordersResp.success && ordersResp.data) {
      data.orders = ordersResp.data.content || []
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  }

  try {
    // Fetch products
    const productsResp = await productsApi.getSellerProducts(0, 100)
    if (productsResp.success && productsResp.data) {
      data.products = productsResp.data.content || []
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }

  return data
}

