"use client"

import { Apple, Download } from "lucide-react"

export function DownloadAppSection() {
  return (
    <section className="bg-gradient-to-r from-amber-50 to-yellow-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          {/* Left - Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Tải Ứng Dụng ShopCuaThuy</h2>
              <p className="text-lg text-muted-foreground">Mua sắm dễ dàng hơn, tiết kiệm hơn với ứng dụng di động</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                    <Download className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Giao diện thân thiện</h3>
                  <p className="text-sm text-muted-foreground">Dễ dàng tìm kiếm và mua sắm sản phẩm yêu thích</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                    <Download className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Thông báo tức thời</h3>
                  <p className="text-sm text-muted-foreground">Nhận thông báo về đơn hàng, khuyến mãi và flash sale</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                    <Download className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Thanh toán an toàn</h3>
                  <p className="text-sm text-muted-foreground">Nhiều phương thức thanh toán, bảo mật tối đa</p>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                <Apple className="h-5 w-5" />
                App Store
              </button>
              <button className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                <Download className="h-5 w-5" />
                Google Play
              </button>
            </div>
          </div>

          {/* Right - QR Code & Phone */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Quét mã QR để tải</p>
                  <div className="bg-gray-100 rounded-lg p-4 inline-block">
                    <img src="/qr-code.jpg" alt="QR Code" className="h-40 w-40 rounded" />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs text-center text-muted-foreground mb-3">Hoặc tải trực tiếp từ</p>
                  <div className="space-y-2">
                    <img src="/app-store.jpg" alt="App Store" className="w-full h-auto rounded" />
                    <img src="/google-play.jpg" alt="Google Play" className="w-full h-auto rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
