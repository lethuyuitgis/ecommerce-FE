"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { shipperApi } from "@/lib/api/shipper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Truck, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"

export function ShipperRegisterClient() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)

  // Kiểm tra trạng thái nếu đã là SHIPPER
  useEffect(() => {
    if (user?.userType === 'SHIPPER') {
      shipperApi.getApprovalStatus()
        .then(res => {
          if (res.success && res.data) {
            setApprovalStatus(res.data)
          }
        })
        .catch(() => {
          setApprovalStatus(null)
        })
        .finally(() => {
          setCheckingStatus(false)
        })
    } else {
      setCheckingStatus(false)
    }
  }, [user])

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/shipper/register')
      return
    }

    if (user?.userType === 'SHIPPER') {
      toast.info('Bạn đã đăng ký làm shipper rồi')
      return
    }

    if (user?.userType !== 'CUSTOMER') {
      toast.error('Chỉ tài khoản khách hàng mới có thể đăng ký làm shipper')
      return
    }

    setLoading(true)
    try {
      const response = await shipperApi.register()
      if (response.success) {
        toast.success(response.data || 'Đăng ký shipper thành công. Vui lòng chờ admin phê duyệt.')
        // Reload page để cập nhật user type
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.error(response.message || 'Không thể đăng ký shipper')
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đăng ký')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Đăng ký làm Shipper</CardTitle>
            <CardDescription>Vui lòng đăng nhập để đăng ký làm shipper</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login?redirect=/shipper/register')}>
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (checkingStatus) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center">Đang kiểm tra...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Nếu đã là SHIPPER, hiển thị trạng thái
  if (user?.userType === 'SHIPPER') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Trạng thái Shipper
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvalStatus === 'APPROVED' ? (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Đã được phê duyệt</span>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  APPROVED
                </Badge>
                <p className="text-muted-foreground">
                  Tài khoản shipper của bạn đã được phê duyệt. Bạn có thể bắt đầu nhận đơn hàng.
                </p>
                <Button onClick={() => router.push('/ship')}>
                  Đi đến bảng điều khiển
                </Button>
              </>
            ) : approvalStatus === 'PENDING' ? (
              <>
                <div className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Đang chờ phê duyệt</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  PENDING
                </Badge>
                <p className="text-muted-foreground">
                  Tài khoản shipper của bạn đang chờ admin phê duyệt. Vui lòng chờ trong giây lát.
                </p>
              </>
            ) : approvalStatus === 'REJECTED' ? (
              <>
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-semibold">Đã bị từ chối</span>
                </div>
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  REJECTED
                </Badge>
                <p className="text-muted-foreground">
                  Tài khoản shipper của bạn đã bị từ chối. Vui lòng liên hệ admin để biết thêm chi tiết.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-blue-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Chưa xác định trạng thái</span>
                </div>
                <p className="text-muted-foreground">
                  Không thể xác định trạng thái phê duyệt. Vui lòng thử lại sau.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Nếu chưa đăng ký, hiển thị form đăng ký
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Đăng ký làm Shipper
          </CardTitle>
          <CardDescription>
            Đăng ký để trở thành shipper và nhận đơn hàng vận chuyển
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Thông tin về Shipper</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
              <li>Nhận và vận chuyển đơn hàng từ seller đến khách hàng</li>
              <li>Cập nhật trạng thái vận chuyển theo thời gian thực</li>
              <li>Quản lý đơn hàng được điều phối cho bạn</li>
              <li>Cần được admin phê duyệt trước khi bắt đầu</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Lưu ý</p>
                <p className="text-sm text-yellow-800">
                  Sau khi đăng ký, tài khoản của bạn sẽ chuyển sang loại SHIPPER và cần được admin phê duyệt 
                  trước khi bạn có thể nhận đơn hàng. Vui lòng chờ admin xem xét và phê duyệt.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleRegister} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký làm Shipper'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

