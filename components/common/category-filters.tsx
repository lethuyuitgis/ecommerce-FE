"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { Slider } from "../ui/slider"

interface CategoryFiltersProps {
  subcategories: string[]
  currentFilters: { [key: string]: string | string[] | undefined }
}

export function CategoryFilters({ subcategories, currentFilters }: CategoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 10000000])

  const handleSubcategoryChange = (subcategory: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll("subcategory")

    if (checked) {
      params.append("subcategory", subcategory)
    } else {
      params.delete("subcategory")
      current.filter((s) => s !== subcategory).forEach((s) => params.append("subcategory", s))
    }

    router.push(`?${params.toString()}`)
  }

  const handleRatingFilter = (rating: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("rating", rating.toString())
    router.push(`?${params.toString()}`)
  }

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(window.location.pathname)
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Bộ lọc</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Xóa tất cả
        </Button>
      </div>

      {/* Subcategories */}
      <div>
        <h4 className="font-medium mb-3">Danh mục con</h4>
        <div className="space-y-2">
          {subcategories.map((subcategory) => (
            <div key={subcategory} className="flex items-center gap-2">
              <Checkbox
                id={subcategory}
                onCheckedChange={(checked) => handleSubcategoryChange(subcategory, checked as boolean)}
              />
              <Label htmlFor={subcategory} className="cursor-pointer">
                {subcategory}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Khoảng giá</h4>
        <div className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={10000000} step={100000} className="w-full" />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{priceRange[0].toLocaleString("vi-VN")}đ</span>
            <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
          </div>
          <Button onClick={handlePriceFilter} className="w-full">
            Áp dụng
          </Button>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-medium mb-3">Đánh giá</h4>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm">trở lên</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div>
        <h4 className="font-medium mb-3">Dịch vụ</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="freeship" />
            <Label htmlFor="freeship" className="cursor-pointer">
              Miễn phí vận chuyển
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cod" />
            <Label htmlFor="cod" className="cursor-pointer">
              Thanh toán khi nhận hàng
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
