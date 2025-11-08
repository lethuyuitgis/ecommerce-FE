import Link from "next/link"
import { Facebook, Instagram, Youtube, Truck, CreditCard, Shield } from "lucide-react"

export function Footer() {
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
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <img src="/visa-application-process.png" alt="Visa" className="h-6 object-contain" />
                </div>
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <img src="/mastercard-logo-abstract.png" alt="Mastercard" className="h-6 object-contain" />
                </div>
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <span className="text-xs font-bold text-primary">JCB</span>
                </div>
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <span className="text-xs font-bold">MoMo</span>
                </div>
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <span className="text-xs font-bold text-blue-600">ZaloPay</span>
                </div>
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <span className="text-xs font-bold">COD</span>
                </div>
              </div>
            </div>

            {/* Shipping Partners */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">ĐỐI TÁC VẬN CHUYỂN</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <span className="text-xs font-bold text-red-600">GHN</span>
                </div>
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <span className="text-xs font-bold text-blue-600">GHTK</span>
                </div>
                <div className="flex h-12 items-center justify-center rounded border bg-white p-1 hover:shadow-md transition">
                  <span className="text-xs font-bold text-orange-600">Viettel</span>
                </div>
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
                <Link href="/help-center" className="hover:text-primary transition">
                  Trung Tâm Trợ Giúp
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-primary transition">
                  Hướng Dẫn Mua Hàng
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary transition">
                  Hướng Dẫn Bán Hàng
                </Link>
              </li>
              <li>
                <Link href="/shipping-info" className="hover:text-primary transition">
                  Vận Chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary transition">
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
                <Link href="/about" className="hover:text-primary transition">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition">
                  Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition">
                  Điều Khoản
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="/authentic" className="hover:text-primary transition">
                  Chính Hãng
                </Link>
              </li>
              <li>
                <Link href="/flash-sales" className="hover:text-primary transition">
                  Flash Sales
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
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
