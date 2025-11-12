"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"

export function RequireSeller({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading")

    useEffect(() => {
        let mounted = true
        apiClient<any>('/seller/profile')
            .then((resp) => {
                if (!mounted) return
                if (resp?.success && resp?.data) {
                    setStatus("ok")
                } else {
                    setStatus("missing")
                }
            })
            .catch(() => {
                if (!mounted) return
                setStatus("missing")
            })
        return () => { mounted = false }
    }, [])

    if (status === "loading") {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
                Đang kiểm tra tài khoản người bán...
            </div>
        )
    }

    if (status === "missing") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="max-w-md rounded-lg border bg-card p-6 text-center">
                    <h2 className="text-lg font-semibold">Bạn chưa tạo hồ sơ người bán</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Hãy tạo hồ sơ người bán để truy cập Trung tâm Người bán.
                    </p>
                    <div className="mt-4 flex justify-center">
                        <Button onClick={() => router.replace("/seller/onboarding")}>
                            Tạo hồ sơ người bán
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}



