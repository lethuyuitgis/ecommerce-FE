'use client'

import type React from "react"
import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { RouteLoadingProvider } from "@/contexts/RouteLoadingContext"
import { RouteLoadingIndicator } from "@/components/common/route-loading-indicator"
import { SyncUserCookie } from "@/components/common/sync-user-cookie"
import { getBrowserQueryClient } from "@/lib/query/query-client"

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => getBrowserQueryClient())

    return (
        <RouteLoadingProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <CartProvider>
                        <SyncUserCookie />
                        {children}
                        <Toaster position="top-right" richColors />
                    </CartProvider>
                </AuthProvider>
                {process.env.NODE_ENV === "development" ? <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> : null}
            </QueryClientProvider>
            <RouteLoadingIndicator />
        </RouteLoadingProvider>
    )
}