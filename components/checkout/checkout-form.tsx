"use client"

import { useState, useEffect } from "react"
import { MapPin, CreditCard, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userApi, UserAddress } from "@/lib/api/user"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getProvinces, getWardsByProvinceName, type Province, type Ward } from "@/lib/data/vietnam-addresses"

interface CheckoutFormProps {
  selectedAddressId?: string
  onAddressChange?: (addressId: string) => void
  paymentMethod?: string
  onPaymentMethodChange?: (method: string) => void
  note?: string
  onNoteChange?: (note: string) => void
}

export function CheckoutForm({
  selectedAddressId: externalSelectedAddressId,
  onAddressChange,
  paymentMethod: externalPaymentMethod,
  onPaymentMethodChange,
  note: externalNote,
  onNoteChange,
}: CheckoutFormProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState(externalPaymentMethod || "cod")
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>(externalSelectedAddressId || "")
  const [provinces] = useState<Province[]>(getProvinces())
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [availableWards, setAvailableWards] = useState<Ward[]>([])
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    ward: "",
    address: "",
    note: externalNote || "",
  })
  const [useNewAddress, setUseNewAddress] = useState(false)

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
    onPaymentMethodChange?.(method)
  }

  const handleNoteChange = (note: string) => {
    setFormData({ ...formData, note })
    onNoteChange?.(note)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchAddresses = async () => {
      try {
        const response = await userApi.getAddresses()
        if (response.success && response.data) {
          setAddresses(response.data)
          if (response.data.length > 0) {
            const defaultAddressId = response.data[0].id
            setSelectedAddressId(defaultAddressId)
            onAddressChange?.(defaultAddressId)
            const defaultAddress = response.data[0]
            const provinceName = defaultAddress.province || defaultAddress.city || ""
            setSelectedProvince(provinceName)
            const wards = getWardsByProvinceName(provinceName)
            setAvailableWards(wards)
            setFormData({
              fullName: defaultAddress.fullName,
              phone: defaultAddress.phone,
              email: defaultAddress.email || "",
              province: provinceName,
              ward: defaultAddress.ward,
              address: defaultAddress.address || defaultAddress.street || "",
              note: externalNote || "",
            })
          } else {
            setUseNewAddress(true)
          }
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error)
        setUseNewAddress(true)
      }
    }

    fetchAddresses()
  }, [isAuthenticated, router])

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId)
    onAddressChange?.(addressId)
    const address = addresses.find(a => a.id === addressId)
    if (address) {
      const provinceName = address.province || address.city || ""
      setSelectedProvince(provinceName)
      const wards = getWardsByProvinceName(provinceName)
      setAvailableWards(wards)
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        email: address.email || "",
        province: provinceName,
        ward: address.ward,
        address: address.address || address.street || "",
        note: formData.note,
      })
      setUseNewAddress(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Shipping Address */}
      <div className="rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Địa Chỉ Nhận Hàng</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/profile?tab=addresses')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ mới
          </Button>
        </div>

        {addresses.length > 0 && !useNewAddress && (
          <RadioGroup value={selectedAddressId} onValueChange={handleAddressChange}>
            <div className="mb-4 space-y-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${selectedAddressId === address.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                    }`}
                  onClick={() => handleAddressChange(address.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-medium text-foreground">{address.fullName}</span>
                        {address.isDefault && (
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">Mặc định</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.address || address.street}, {address.ward}, {address.province}
                      </p>
                    </div>
                    <RadioGroupItem value={address.id} id={address.id} />
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUseNewAddress(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm địa chỉ mới
              </Button>
            </div>
          </RadioGroup>
        )}

        {useNewAddress && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="province">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) => {
                    setSelectedProvince(value)
                    const wards = getWardsByProvinceName(value)
                    setAvailableWards(wards)
                    setFormData({ ...formData, province: value, ward: "" })
                  }}
                  required
                >
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ward">
                  Phường/Xã <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.ward}
                  onValueChange={(value) => setFormData({ ...formData, ward: value })}
                  required
                  disabled={!selectedProvince || availableWards.length === 0}
                >
                  <SelectTrigger id="ward">
                    <SelectValue placeholder={selectedProvince ? "Chọn phường/xã" : "Chọn tỉnh trước"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWards.map((ward) => (
                      <SelectItem key={ward.code} value={ward.name}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Địa chỉ cụ thể</Label>
              <Textarea
                id="address"
                placeholder="Nhập địa chỉ cụ thể"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Phương Thức Thanh Toán</h2>
        </div>
        <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex flex-1 cursor-pointer items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-foreground">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex flex-1 cursor-pointer items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Chuyển khoản ngân hàng</div>
                  <div className="text-sm text-muted-foreground">Chuyển khoản qua tài khoản ngân hàng</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="momo" id="momo" />
              <Label htmlFor="momo" className="flex flex-1 cursor-pointer items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                  <span className="text-lg font-bold text-pink-600">M</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">Ví MoMo</div>
                  <div className="text-sm text-muted-foreground">Thanh toán qua ví điện tử MoMo</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="zalopay" id="zalopay" />
              <Label htmlFor="zalopay" className="flex flex-1 cursor-pointer items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-lg font-bold text-blue-600">Z</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">ZaloPay</div>
                  <div className="text-sm text-muted-foreground">Thanh toán qua ví điện tử ZaloPay</div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Note */}
      <div className="rounded-lg bg-white p-6">
        <Label htmlFor="note">Ghi chú đơn hàng (Tùy chọn)</Label>
        <Textarea
          id="note"
          placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
          rows={4}
          className="mt-2"
          value={formData.note}
          onChange={(e) => handleNoteChange(e.target.value)}
        />
      </div>
    </div>
  )
}

