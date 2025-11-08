import { Skeleton } from "@/components/ui/skeleton"

export default function TrackingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-16 mb-8 rounded-lg" />
        <Skeleton className="h-96 mb-6 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  )
}
