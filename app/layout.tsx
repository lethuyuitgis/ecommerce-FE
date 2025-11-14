import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { RouteLoadingProvider } from "@/contexts/RouteLoadingContext"
import { RouteLoadingIndicator } from "@/components/common/route-loading-indicator"
import "./globals.css"

export const metadata: Metadata = {
  title: "ShopCuaThuy - Mua Sắm Trực Tuyến",
  description: "Nền tảng thương mại điện tử hàng đầu Việt Nam",
  generator: "thuy",
  icons: ""
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <RouteLoadingProvider>
          <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Analytics />
            <Toaster position="top-right" richColors />
          </AuthProvider>
          <RouteLoadingIndicator />
        </RouteLoadingProvider>
      </body>
    </html>
  )
}
