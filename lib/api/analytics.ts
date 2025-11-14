import { apiClient, ApiResponse } from "./client"

export interface SellerAnalyticsOverview {
  revenue: number
  revenueChange: number
  orders: number
  ordersChange: number
  averageOrderValue: number
  averageOrderValueChange: number
  conversionRate: number
  conversionRateChange: number
}

export interface RevenuePoint {
  date: string
  revenue: number
  profit: number
  orders: number
}

export interface CategoryRevenue {
  category: string
  revenue: number
}

export interface CustomerType {
  name: string
  value: number
  color: string
}

export interface CustomerLocation {
  city: string
  customers: number
}

export interface TrafficPoint {
  date: string
  views: number
  visitors: number
  bounceRate: number
}

export interface TrafficSource {
  source: string
  visitors: number
}

export interface TopProduct {
  id: string
  name: string
  image: string
  sold: number
  revenue: number
  trend: string
  trendUp: boolean
}

export interface LowStockProduct {
  name: string
  stock: number
  status: string
}

export interface SellerAnalyticsDashboard {
  overview: SellerAnalyticsOverview
  revenueSeries: RevenuePoint[]
  categorySeries: CategoryRevenue[]
  customerTypes: CustomerType[]
  customerLocations: CustomerLocation[]
  trafficSeries: TrafficPoint[]
  trafficSources: TrafficSource[]
  topProducts: TopProduct[]
  lowStockProducts: LowStockProduct[]
}

export const analyticsApi = {
  getDashboard: async (period: string = '30days'): Promise<ApiResponse<SellerAnalyticsDashboard>> => {
    return apiClient<SellerAnalyticsDashboard>(`/seller/analytics/dashboard?period=${period}`, {}, true)
  }
}


