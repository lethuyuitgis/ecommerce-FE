"use client"

import { TrackingUpdate } from "@/lib/api/logistics"
import { Check, Truck, MapPin, Package, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface TrackingTimelineProps {
  updates: TrackingUpdate[]
}

export function TrackingTimeline({ updates }: TrackingTimelineProps) {
  if (!updates || updates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Clock className="h-10 w-10 mb-2 opacity-20" />
        <p>Đang cập nhật thông tin vận chuyển...</p>
      </div>
    )
  }

  return (
    <div className="space-y-0 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
      {updates.map((update, index) => {
        const isLatest = index === 0
        return (
          <div key={update.id} className="relative pl-10 pb-8 last:pb-0">
            <div className={`absolute left-0 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background ${
              isLatest ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-muted text-muted-foreground'
            }`}>
              {getStatusIcon(update.status, isLatest)}
            </div>
            
            <div className={`flex flex-col ${isLatest ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${isLatest ? 'text-lg' : 'text-sm'}`}>
                  {update.status}
                </span>
                <span className="text-[10px]">
                  {new Date(update.timestamp).toLocaleString('vi-VN')}
                </span>
              </div>
              
              <span className="text-xs font-medium flex items-center gap-1 mt-1 opacity-80">
                <MapPin className="h-3 w-3" />
                {update.location}
              </span>
              
              <div className={`mt-2 rounded-lg p-3 text-sm ${isLatest ? 'bg-primary/5 border border-primary/10' : 'bg-muted/30'}`}>
                {update.description}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getStatusIcon(status: string, isLatest: boolean) {
  const s = status.toUpperCase()
  const size = isLatest ? 14 : 12
  
  if (s.includes('DELIVERED')) return <Check size={size} strokeWidth={3} />
  if (s.includes('DELIVERY')) return <Truck size={size} />
  if (s.includes('HUB') || s.includes('STATION')) return <MapPin size={size} />
  if (s.includes('PICK')) return <Package size={size} />
  return <Clock size={size} />
}
