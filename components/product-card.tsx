import { Star, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {product.discount && (
            <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">-{product.discount}%</Badge>
          )}
          {product.freeShip && (
            <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground">Freeship</Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="mb-2 line-clamp-2 text-sm leading-tight text-foreground">{product.name}</h3>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-primary">₫{product.price.toLocaleString("vi-VN")}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₫{product.originalPrice.toLocaleString("vi-VN")}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span className="mx-1">|</span>
              <span>Đã bán {product.sold}</span>
            </div>
          </div>
          {product.location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{product.location}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
