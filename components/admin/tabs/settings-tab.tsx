import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình hệ thống</CardTitle>
        <p className="text-sm text-muted-foreground">Các tùy chọn sẽ được cập nhật ở phiên bản sau.</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          Đang phát triển. Bạn muốn ưu tiên phần nào? Hãy cho chúng tôi biết!
        </div>
      </CardContent>
    </Card>
  )
}


