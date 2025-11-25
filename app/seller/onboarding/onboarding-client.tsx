'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api/client"
import { useRouter } from "next/navigation"

export function OnboardingClient() {
    const router = useRouter()
    const [shopName, setShopName] = useState("Shop của tôi")
    const [loading, setLoading] = useState(false)

    const handleCreate = async () => {
        try {
            setLoading(true)
            const resp = await apiClient<any>('/seller/create', {
                method: 'POST',
                body: JSON.stringify({ shopName }),
            })
            if (resp?.success) {
                router.replace('/seller')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-xl rounded-lg border bg-card p-6">
            <h1 className="text-2xl font-bold">Tạo hồ sơ Người bán</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Bạn cần tạo hồ sơ người bán để truy cập Trung tâm Người bán.
            </p>
            <div className="mt-4 flex flex-col gap-2">
                <Label htmlFor="shopName">Tên shop</Label>
                <Input id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} />
            </div>
            <div className="mt-6">
                <Button onClick={handleCreate} disabled={loading} className="w-full">
                    {loading ? "Đang tạo..." : "Tạo hồ sơ"}
                </Button>
            </div>
        </div>
    )
}

