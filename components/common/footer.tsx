'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Facebook, Instagram, Youtube, Truck, CreditCard, Shield } from "lucide-react"
import { paymentApi, type PaymentMethod } from "@/lib/api/payment"
import { shippingApi, type ShippingMethod } from "@/lib/api/shipping"

type PaymentBadge = {
  key: string
  label: string
  image?: string
  textClass?: string
}

type ShippingBadge = {
  key: string
  label: string
  textClass?: string
}

const DEFAULT_PAYMENT_BADGES: PaymentBadge[] = [
  { key: "visa", label: "Visa", image: "/visa-application-process.png" },
  { key: "mastercard", label: "Mastercard", image: "/mastercard-logo-abstract.png" },
  { key: "jcb", label: "JCB", textClass: "text-primary" },
  { key: "momo", label: "MoMo" },
  { key: "zalopay", label: "ZaloPay", textClass: "text-blue-600" },
  { key: "cod", label: "COD" },
]

const DEFAULT_SHIPPING_BADGES: ShippingBadge[] = [
  { key: "ghn", label: "GHN", textClass: "text-red-600" },
  { key: "ghtk", label: "GHTK", textClass: "text-blue-600" },
  { key: "viettel", label: "Viettel", textClass: "text-orange-600" },
]

const PAYMENT_ICON_MAP: Record<string, PaymentBadge> = {
  VISA: DEFAULT_PAYMENT_BADGES[0],
  MASTERCARD: DEFAULT_PAYMENT_BADGES[1],
  JCB: DEFAULT_PAYMENT_BADGES[2],
  MOMO: DEFAULT_PAYMENT_BADGES[3],
  ZALOPAY: DEFAULT_PAYMENT_BADGES[4],
  COD: DEFAULT_PAYMENT_BADGES[5],
  CASH_ON_DELIVERY: DEFAULT_PAYMENT_BADGES[5],
  BANK: { key: "bank", label: "Bank" },
  VNPAY: { key: "vnpay", label: "VNPay", textClass: "text-blue-500" },
  PAYPAL: { key: "paypal", label: "PayPal", textClass: "text-blue-500" },
}

export function Footer() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const [paymentRes, shippingRes] = await Promise.allSettled([
          paymentApi.getMethods(),
          shippingApi.getMethods(),
        ])

        if (mounted && paymentRes.status === "fulfilled" && paymentRes.value.success && paymentRes.value.data) {
          setPaymentMethods(paymentRes.value.data.filter((m) => m.isActive !== false))
        }

        if (mounted && shippingRes.status === "fulfilled" && shippingRes.value.success && shippingRes.value.data) {
          setShippingMethods(shippingRes.value.data.filter((m) => m.isActive !== false))
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Footer] Failed to load payment/shipping info", error)
        }
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  const paymentBadges = useMemo<PaymentBadge[]>(() => {
    if (!paymentMethods.length) {
      return DEFAULT_PAYMENT_BADGES
    }
    return paymentMethods.map((method) => {
      const code = (method.code || method.name || "").toUpperCase()
      const mapped = PAYMENT_ICON_MAP[code]
      return {
        key: method.id || method.name,
        label: method.name,
        image: method.icon || mapped?.image,
        textClass: mapped?.textClass,
      }
    })
  }, [paymentMethods])

  const shippingBadges = useMemo<ShippingBadge[]>(() => {
    if (!shippingMethods.length) {
      return DEFAULT_SHIPPING_BADGES
    }
    return shippingMethods.map((method) => ({
      key: method.id || method.code || method.name,
      label: method.name || method.code || "Shipping",
    }))
  }, [shippingMethods])

  return (
    <footer className="bg-background border-t">
      {/* Payment & Shipping Section */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Payment Methods */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">PHƯƠNG THỨC THANH TOÁN</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {paymentBadges.map((method) => (
                  <div
                    key={method.key}
                    className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition"
                    title={method.label}
                  >
                    {method.image ? (
                      <img src={method.image} alt={method.label} className="h-6 object-contain" />
                    ) : (
                      <span className={`text-xs font-bold ${method.textClass || ""}`}>{method.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Partners */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">ĐỐI TÁC VẬN CHUYỂN</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {shippingBadges.map((partner) => (
                  <div
                    key={partner.key}
                    className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition"
                  >
                    <span className={`text-xs font-bold ${partner.textClass || ""}`}>{partner.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & Certification */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">CHỨNG CHỈ & BẢO MẬT</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Hàng chính hãng 100%</p>
                <p>✓ Bảo vệ người mua</p>
                <p>✓ Giao hàng nhanh chóng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">CHĂM SÓC KHÁCH HÀNG</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help-center" prefetch={false} className="hover:text-primary transition">
                  Trung Tâm Trợ Giúp
                </Link>
              </li>
              <li>
                <Link href="/blog" prefetch={false} className="hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/payment" prefetch={false} className="hover:text-primary transition">
                  Hướng Dẫn Mua Hàng
                </Link>
              </li>
              <li>
                <Link href="/shipping" prefetch={false} className="hover:text-primary transition">
                  Hướng Dẫn Bán Hàng
                </Link>
              </li>
              <li>
                <Link href="/shipping-info" prefetch={false} className="hover:text-primary transition">
                  Vận Chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" prefetch={false} className="hover:text-primary transition">
                  Trả Hàng & Hoàn Tiền
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">VỀ SHOPCUATHUY</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" prefetch={false} className="hover:text-primary transition">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/careers" prefetch={false} className="hover:text-primary transition">
                  Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={false} className="hover:text-primary transition">
                  Điều Khoản
                </Link>
              </li>
              <li>
                <Link href="/privacy" prefetch={false} className="hover:text-primary transition">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="/authentic" prefetch={false} className="hover:text-primary transition">
                  Chính Hãng
                </Link>
              </li>
              <li>
                <Link href="/flash-sales" prefetch={false} className="hover:text-primary transition">
                  Flash Sales
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={false} className="hover:text-primary transition">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">THEO DÕI CHÚNG TÔI</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="https://facebook.com" className="flex items-center gap-2 hover:text-primary transition">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="flex items-center gap-2 hover:text-primary transition">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://youtube.com" className="flex items-center gap-2 hover:text-primary transition">
                  <Youtube className="h-4 w-4" />
                  Youtube
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold text-sm">LIÊN HỆ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Email:</span>
                <br />
                <a href="mailto:support@shopcuathuy.com" className="hover:text-primary transition">
                  support@shopcuathuy.com
                </a>
              </li>
              <li>
                <span className="font-medium text-foreground">Hotline:</span>
                <br />
                <a href="tel:1900123456" className="hover:text-primary transition">
                  1900 123 456
                </a>
              </li>
              <li>
                <span className="font-medium text-foreground">Địa chỉ:</span>
                <br />
                <span>123 Đường ABC, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8">
          <div className="text-center text-sm text-muted-foreground mb-4">
            <p>© 2025 ShopCuaThuy. Tất cả các quyền được bảo lưu.</p>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            <p>Công ty TNHH ShopCuaThuy | Mã số thuế: 0123456789</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
