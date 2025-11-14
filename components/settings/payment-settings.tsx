"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Wallet, Banknote } from "lucide-react"
import { paymentApi, PaymentMethod, BankInfo } from "@/lib/api/payment"
import { toast } from "sonner"

const paymentMethodIcons: Record<string, typeof Banknote> = {
  cod: Banknote,
  bank: CreditCard,
  momo: Wallet,
  zalopay: Wallet,
}

export function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditBank, setShowEditBank] = useState(false)
  const [bankFormData, setBankFormData] = useState<BankInfo>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branch: "",
  })

  useEffect(() => {
    fetchPaymentSettings()
  }, [])

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true)
      const response = await paymentApi.getSettings()
      if (response.success && response.data) {
        setPaymentMethods(response.data.paymentMethods || [])
        setBankInfo(response.data.bankInfo || null)
        if (response.data.bankInfo) {
          setBankFormData(response.data.bankInfo)
        }
      }
    } catch (error) {
      console.error('Failed to fetch payment settings:', error)
      // Fallback to default methods
      setPaymentMethods([
        { id: "cod", name: "Thanh toán khi nhận hàng (COD)", code: "cod", enabled: true },
        { id: "bank", name: "Chuyển khoản ngân hàng", code: "bank", enabled: true },
        { id: "momo", name: "Ví MoMo", code: "momo", enabled: false },
        { id: "zalopay", name: "ZaloPay", code: "zalopay", enabled: false },
      ])
      toast.error("Tải cài đặt thanh toán thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMethod = async (methodId: string, enabled: boolean) => {
    try {
      setSaving(true)
      const response = await paymentApi.updatePaymentMethod(methodId, enabled)
      if (response.success && response.data) {
        setPaymentMethods((prev) =>
          prev.map((m) => (m.id === methodId ? { ...m, enabled } : m))
        )
        toast.success("Cập nhật phương thức thanh toán thành công")
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại")
      // Revert toggle on error
      setPaymentMethods((prev) =>
        prev.map((m) => (m.id === methodId ? { ...m, enabled: !enabled } : m))
      )
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBankInfo = async () => {
    try {
      setSaving(true)
      const response = await paymentApi.updateBankInfo(bankFormData)
      if (response.success && response.data) {
        setBankInfo(response.data)
        setShowEditBank(false)
        toast.success("Cập nhật thông tin ngân hàng thành công")
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thông tin ngân hàng thất bại")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
          <CardDescription>Quản lý các phương thức thanh toán</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có phương thức thanh toán nào</p>
            </div>
          ) : (
            paymentMethods.map((method) => {
              const Icon = paymentMethodIcons[method.code] || CreditCard
              return (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={(checked) => handleToggleMethod(method.id, checked)}
                    disabled={saving}
                  />
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin ngân hàng</CardTitle>
          <CardDescription>Cập nhật thông tin tài khoản nhận tiền</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showEditBank && bankInfo ? (
            <>
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-medium">{bankInfo.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-medium font-mono">{bankInfo.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-medium">{bankInfo.accountHolder}</span>
                </div>
                {bankInfo.branch && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chi nhánh:</span>
                    <span className="font-medium">{bankInfo.branch}</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowEditBank(true)}
              >
                Chỉnh sửa thông tin
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Tên ngân hàng</Label>
                <Input
                  id="bank-name"
                  value={bankFormData.bankName}
                  onChange={(e) =>
                    setBankFormData({ ...bankFormData, bankName: e.target.value })
                  }
                  placeholder="VD: Vietcombank"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Số tài khoản</Label>
                <Input
                  id="account-number"
                  value={bankFormData.accountNumber}
                  onChange={(e) =>
                    setBankFormData({ ...bankFormData, accountNumber: e.target.value })
                  }
                  placeholder="VD: 1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-holder">Chủ tài khoản</Label>
                <Input
                  id="account-holder"
                  value={bankFormData.accountHolder}
                  onChange={(e) =>
                    setBankFormData({ ...bankFormData, accountHolder: e.target.value })
                  }
                  placeholder="VD: NGUYEN VAN A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Chi nhánh (tùy chọn)</Label>
                <Input
                  id="branch"
                  value={bankFormData.branch || ""}
                  onChange={(e) =>
                    setBankFormData({ ...bankFormData, branch: e.target.value })
                  }
                  placeholder="VD: Chi nhánh Hà Nội"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEditBank(false)
                    if (bankInfo) {
                      setBankFormData(bankInfo)
                    }
                  }}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveBankInfo}
                  disabled={saving || !bankFormData.bankName || !bankFormData.accountNumber || !bankFormData.accountHolder}
                >
                  {saving ? "Đang lưu..." : "Lưu thông tin"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
