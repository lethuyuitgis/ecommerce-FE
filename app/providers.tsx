'use client'

import type React from "react"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { RouteLoadingProvider } from "@/contexts/RouteLoadingContext"
import { RouteLoadingIndicator } from "@/components/common/route-loading-indicator"
import { SyncUserCookie } from "@/components/common/sync-user-cookie"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <RouteLoadingProvider>
            <AuthProvider>
                <SyncUserCookie />
                {children}
                <Toaster position="top-right" richColors />
            </AuthProvider>
            <RouteLoadingIndicator />
        </RouteLoadingProvider>
    )
}