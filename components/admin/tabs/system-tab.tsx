"use client"

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface SystemTabProps {
  initialMetrics?: { startedAt: string; requestCount: number; errorCount: number; avgResponseMs: number } | null
}

export function SystemTab({ initialMetrics }: SystemTabProps) {
  const [metrics, setMetrics] = useState<{ startedAt: string; requestCount: number; errorCount: number; avgResponseMs: number } | null>(initialMetrics || null)
  const [loading, setLoading] = useState(false)

  const loadMetrics = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getSystemMetrics()
      setMetrics(data)
    } catch (error: any) {
      toast.error(error?.message || 'Không thể tải số liệu hệ thống')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialMetrics) {
      loadMetrics()
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Metrics</CardTitle>
          <p className="text-sm text-muted-foreground">Theo dõi uptime và hiệu suất API</p>
        </div>
        <Button variant="outline" onClick={loadMetrics} disabled={loading}>
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </CardHeader>
      <CardContent>
        {!metrics ? (
          <div className="text-muted-foreground">Chưa có dữ liệu.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Started At</div>
              <div className="text-lg font-medium">{new Date(metrics.startedAt).toLocaleString('vi-VN')}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Requests</div>
              <div className="text-lg font-medium">{metrics.requestCount}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Errors</div>
              <div className="text-lg font-medium">{metrics.errorCount}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Avg Response (ms)</div>
              <div className="text-lg font-medium">{metrics.avgResponseMs}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


