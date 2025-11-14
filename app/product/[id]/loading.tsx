export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb skeleton */}
        <div className="mb-4 h-4 w-64 bg-muted animate-pulse rounded" />
        
        {/* Product skeleton */}
        <div className="rounded-lg bg-white p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Image skeleton */}
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            
            {/* Info skeleton */}
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-6 w-1/2 bg-muted animate-pulse rounded" />
              <div className="h-12 w-1/3 bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

