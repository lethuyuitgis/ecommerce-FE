"use client"

import { useState, useEffect } from 'react'
import { adminApi, PendingSeller, PendingShipper } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react'

export function ApprovalsTab() {
  const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([])
  const [pendingShippers, setPendingShippers] = useState<PendingShipper[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [sellers, shippers] = await Promise.all([
        adminApi.getPendingSellers(),
        adminApi.getPendingShippers(),
      ])
      setPendingSellers(sellers)
      setPendingShippers(shippers)
    } catch (e: any) {
      toast.error(e.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApproveSeller = async (sellerId: string) => {
    try {
      await adminApi.approveSeller(sellerId)
      toast.success('Đã phê duyệt seller thành công')
      loadData()
    } catch (e: any) {
      toast.error(e.message || 'Không thể phê duyệt seller')
    }
  }

  const handleRejectSeller = async (sellerId: string) => {
    if (!confirm('Bạn có chắc chắn muốn từ chối seller này?')) return
    try {
      await adminApi.rejectSeller(sellerId)
      toast.success('Đã từ chối seller')
      loadData()
    } catch (e: any) {
      toast.error(e.message || 'Không thể từ chối seller')
    }
  }

  const handleApproveShipper = async (userId: string) => {
    try {
      await adminApi.approveShipper(userId)
      toast.success('Đã phê duyệt shipper thành công')
      loadData()
    } catch (e: any) {
      toast.error(e.message || 'Không thể phê duyệt shipper')
    }
  }

  const handleRejectShipper = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn từ chối shipper này?')) return
    try {
      await adminApi.rejectShipper(userId)
      toast.success('Đã từ chối shipper')
      loadData()
    } catch (e: any) {
      toast.error(e.message || 'Không thể từ chối shipper')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Phê duyệt người dùng</CardTitle>
          <Button onClick={loadData} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sellers" className="w-full">
            <TabsList>
              <TabsTrigger value="sellers">
                Sellers ({pendingSellers.length})
              </TabsTrigger>
              <TabsTrigger value="shippers">
                Shippers ({pendingShippers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sellers" className="mt-4">
              {pendingSellers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Không có seller nào đang chờ phê duyệt</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSellers.map((seller) => (
                    <Card key={seller.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{seller.shopName}</h3>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Clock className="h-3 w-3 mr-1" />
                                PENDING
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div>
                                <p><strong>Email:</strong> {seller.shopEmail || seller.userEmail || 'N/A'}</p>
                                <p><strong>Điện thoại:</strong> {seller.shopPhone || seller.userPhone || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>Tỉnh/TP:</strong> {seller.province || 'N/A'}</p>
                                <p><strong>Quận/Huyện:</strong> {seller.district || 'N/A'}</p>
                              </div>
                            </div>
                            {seller.shopDescription && (
                              <p className="text-sm text-muted-foreground mt-2">
                                <strong>Mô tả:</strong> {seller.shopDescription}
                              </p>
                            )}
                            {seller.userName && (
                              <p className="text-sm text-muted-foreground">
                                <strong>Người đăng ký:</strong> {seller.userName}
                              </p>
                            )}
                            {seller.createdAt && (
                              <p className="text-xs text-muted-foreground">
                                Đăng ký: {new Date(seller.createdAt).toLocaleString('vi-VN')}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleApproveSeller(seller.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Phê duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectSeller(seller.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shippers" className="mt-4">
              {pendingShippers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Không có shipper nào đang chờ phê duyệt</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingShippers.map((shipper) => (
                    <Card key={shipper.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{shipper.fullName || shipper.email}</h3>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Clock className="h-3 w-3 mr-1" />
                                PENDING
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div>
                                <p><strong>Email:</strong> {shipper.email}</p>
                                <p><strong>Điện thoại:</strong> {shipper.phone || 'N/A'}</p>
                              </div>
                              {shipper.createdAt && (
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Đăng ký: {new Date(shipper.createdAt).toLocaleString('vi-VN')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleApproveShipper(shipper.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Phê duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectShipper(shipper.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

