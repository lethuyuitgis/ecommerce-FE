import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-semibold">CHĂM SÓC KHÁCH HÀNG</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help-center" className="hover:text-primary">
                  Trung Tâm Trợ Giúp
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-primary">
                  Hướng Dẫn Mua Hàng
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary">
                  Hướng Dẫn Bán Hàng
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="hover:text-primary">
                  Thanh Toán
                </Link>
              </li>
              <li>
                <Link href="/shipping-info" className="hover:text-primary">
                  Vận Chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary">
                  Trả Hàng & Hoàn Tiền
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 font-semibold">VỀ SHOPCUATHUY</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary">
                  Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Điều Khoản
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="/authentic" className="hover:text-primary">
                  Chính Hãng
                </Link>
              </li>
              <li>
                <Link href="/flash-sales" className="hover:text-primary">
                  Flash Sales
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="mb-4 font-semibold">THANH TOÁN</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/visa-application-process.png" alt="Visa" className="h-6" />
              </div>
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/mastercard-logo-abstract.png" alt="Mastercard" className="h-6" />
              </div>
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/yellow-construction-vehicle.png" alt="JCB" className="h-6" />
              </div>
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/stylized-abstract-creature.png" alt="MoMo" className="h-6" />
              </div>
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/zalopay-app-interface.png" alt="ZaloPay" className="h-6" />
              </div>
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/atlantic-cod.png" alt="COD" className="h-6" />
              </div>
            </div>
            <h3 className="mb-4 mt-6 font-semibold">VẬN CHUYỂN</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/ghn.jpg" alt="GHN" className="h-6" />
              </div>
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/ghtk.jpg" alt="GHTK" className="h-6" />
              </div>
              <div className="flex h-10 items-center justify-center rounded border bg-white p-1">
                <img src="/viettel-post.jpg" alt="Viettel Post" className="h-6" />
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="mb-4 font-semibold">THEO DÕI CHÚNG TÔI</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="https://facebook.com" className="flex items-center gap-2 hover:text-primary">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="flex items-center gap-2 hover:text-primary">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://youtube.com" className="flex items-center gap-2 hover:text-primary">
                  <Youtube className="h-4 w-4" />
                  Youtube
                </Link>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="mb-4 font-semibold">TẢI ỨNG DỤNG</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <img src="/qr-code.jpg" alt="QR Code" className="h-20 w-20 rounded border bg-white" />
                <div className="flex flex-col gap-2">
                  <img src="/app-store.jpg" alt="App Store" className="h-9 rounded" />
                  <img src="/google-play.jpg" alt="Google Play" className="h-9 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 ShopCuaThuy. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
