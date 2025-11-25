'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, MapPin, Check, Loader2 } from "lucide-react"
import { userApi, UserAddress } from "@/lib/api/user"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProvinces, getWardsByProvinceName, type Province, type Ward } from "@/lib/data/vietnam-addresses"

interface AddressesClientProps {
    initialAddresses: UserAddress[]
}

export function AddressesClient({ initialAddresses }: AddressesClientProps) {
    const router = useRouter()
    const [addresses, setAddresses] = useState<UserAddress[]>(initialAddresses)
    const [loading, setLoading] = useState(false)
    const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null)
    const [deletingAddress, setDeletingAddress] = useState<UserAddress | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

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
        addressType: "HOME",
        isDefault: false,
    })

    const fetchAddresses = async () => {
        try {
            setLoading(true)
            const response = await userApi.getAddresses()
            if (response.success && response.data) {
                setAddresses(response.data)
            }
        } catch (error: any) {
            toast.error("Không thể tải danh sách địa chỉ")
            console.error("Error fetching addresses:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenDialog = (address?: UserAddress) => {
        if (address) {
            setEditingAddress(address)
            const provinceName = address.province || ""
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
                addressType: address.addressType || "HOME",
                isDefault: address.isDefault,
            })
        } else {
            setEditingAddress(null)
            setSelectedProvince("")
            setAvailableWards([])
            setFormData({
                fullName: "",
                phone: "",
                email: "",
                province: "",
                ward: "",
                address: "",
                addressType: "HOME",
                isDefault: false,
            })
        }
        setIsDialogOpen(true)
    }

    const handleProvinceChange = (provinceName: string) => {
        setSelectedProvince(provinceName)
        const wards = getWardsByProvinceName(provinceName)
        setAvailableWards(wards)
        setFormData({
            ...formData,
            province: provinceName,
            ward: "",
        })
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setEditingAddress(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.fullName.trim() || !formData.phone.trim() || !formData.province.trim() || !formData.ward.trim() || !formData.address.trim()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        try {
            setSubmitting(true)
            const addressData = {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email || undefined,
                province: formData.province,
                city: formData.province,
                district: "",
                ward: formData.ward,
                address: formData.address,
                street: formData.address,
                addressType: formData.addressType,
                isDefault: formData.isDefault,
            }

            if (editingAddress) {
                const response = await userApi.updateAddress(editingAddress.id, addressData)
                if (response.success) {
                    toast.success("Cập nhật địa chỉ thành công!")
                    await fetchAddresses()
                    handleCloseDialog()
                } else {
                    toast.error(response.message || "Cập nhật địa chỉ thất bại")
                }
            } else {
                const response = await userApi.addAddress(addressData)
                if (response.success) {
                    toast.success("Thêm địa chỉ thành công!")
                    await fetchAddresses()
                    handleCloseDialog()
                } else {
                    toast.error(response.message || "Thêm địa chỉ thất bại")
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Có lỗi xảy ra")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingAddress) return

        try {
            const response = await userApi.deleteAddress(deletingAddress.id)
            if (response.success) {
                toast.success("Xóa địa chỉ thành công!")
                await fetchAddresses()
                setDeletingAddress(null)
            } else {
                toast.error(response.message || "Xóa địa chỉ thất bại")
            }
        } catch (error: any) {
            toast.error(error.message || "Có lỗi xảy ra")
        }
    }

    const handleSetDefault = async (addressId: string) => {
        try {
            const response = await userApi.setDefaultAddress(addressId)
            if (response.success) {
                toast.success("Đặt địa chỉ mặc định thành công!")
                await fetchAddresses()
            } else {
                toast.error(response.message || "Đặt địa chỉ mặc định thất bại")
            }
        } catch (error: any) {
            toast.error(error.message || "Có lỗi xảy ra")
        }
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Địa Chỉ Của Tôi</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm Địa Chỉ
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Đang tải địa chỉ...</p>
                </div>
            ) : addresses.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">Bạn chưa có địa chỉ nào</p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm Địa Chỉ Đầu Tiên
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {addresses.map((address) => (
                        <Card key={address.id} className="relative">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            {address.fullName}
                                            {address.isDefault && (
                                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                                    Mặc định
                                                </span>
                                            )}
                                        </CardTitle>
                                        {address.addressType && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {address.addressType === "HOME" ? "Nhà riêng" : address.addressType === "OFFICE" ? "Văn phòng" : "Khác"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <p className="text-foreground">
                                        <span className="text-muted-foreground">Điện thoại:</span> {address.phone}
                                    </p>
                                    {address.email && (
                                        <p className="text-foreground">
                                            <span className="text-muted-foreground">Email:</span> {address.email}
                                        </p>
                                    )}
                                    <div className="text-foreground">
                                        <span className="text-muted-foreground">Địa chỉ:</span>
                                        <p className="mt-1">
                                            {address.address || address.street}
                                            {address.ward && `, ${address.ward}`}
                                            {address.province && `, ${address.province}`}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="flex flex-wrap gap-2">
                                    {!address.isDefault && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSetDefault(address.id)}
                                        >
                                            <Check className="mr-1 h-3 w-3" />
                                            Đặt mặc định
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOpenDialog(address)}
                                    >
                                        <Edit className="mr-1 h-3 w-3" />
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDeletingAddress(address)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="mr-1 h-3 w-3" />
                                        Xóa
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}</DialogTitle>
                        <DialogDescription>
                            {editingAddress ? "Cập nhật thông tin địa chỉ của bạn" : "Thêm địa chỉ giao hàng mới"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="fullName">
                                    Họ và tên <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phone">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Nhập email (tùy chọn)"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="addressType">Loại địa chỉ</Label>
                                <select
                                    id="addressType"
                                    value={formData.addressType}
                                    onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="HOME">Nhà riêng</option>
                                    <option value="OFFICE">Văn phòng</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="province">
                                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.province}
                                    onValueChange={handleProvinceChange}
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
                            <Label htmlFor="address">
                                Địa chỉ chi tiết <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Nhập số nhà, tên đường..."
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
                                Đặt làm địa chỉ mặc định
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : editingAddress ? (
                                    "Cập nhật"
                                ) : (
                                    "Thêm địa chỉ"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingAddress} onOpenChange={(open) => !open && setDeletingAddress(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa địa chỉ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

