"use client"

import { useState, useEffect } from "react"
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
  
  // Initialize price range from URL params or default
  const minPriceParam = searchParams.get("minPrice")
  const maxPriceParam = searchParams.get("maxPrice")
  const [priceRange, setPriceRange] = useState([
    minPriceParam ? Number(minPriceParam) : 0,
    maxPriceParam ? Number(maxPriceParam) : 10000000
  ])
  
  // Update price range when URL params change
  useEffect(() => {
    if (minPriceParam || maxPriceParam) {
      setPriceRange([
        minPriceParam ? Number(minPriceParam) : 0,
        maxPriceParam ? Number(maxPriceParam) : 10000000
      ])
    }
  }, [minPriceParam, maxPriceParam])

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
          {subcategories.map((subcategory) => {
            const isChecked = searchParams.getAll("subcategory").includes(subcategory)
            return (
              <div key={subcategory} className="flex items-center gap-2">
                <Checkbox
                  id={subcategory}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleSubcategoryChange(subcategory, checked as boolean)}
                />
                <Label htmlFor={subcategory} className="cursor-pointer">
                  {subcategory}
                </Label>
              </div>
            )
          })}
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
        {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
          <div className="mt-2 text-xs text-gray-500">
            Đã áp dụng: {searchParams.get("minPrice") ? `${Number(searchParams.get("minPrice")).toLocaleString("vi-VN")}đ` : '0đ'} - {searchParams.get("maxPrice") ? `${Number(searchParams.get("maxPrice")).toLocaleString("vi-VN")}đ` : '10,000,000đ'}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-medium mb-3">Đánh giá</h4>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => {
            const isActive = searchParams.get("rating") === rating.toString()
            return (
              <button
                key={rating}
                onClick={() => handleRatingFilter(rating)}
                className={`flex items-center gap-2 w-full p-2 rounded transition-colors ${
                  isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm">trở lên</span>
              </button>
            )
          })}
        </div>
        {searchParams.get("rating") && (
          <div className="mt-2 text-xs text-gray-500">
            Đã chọn: {searchParams.get("rating")} sao trở lên
          </div>
        )}
      </div>

      {/* Shipping */}
      <div>
        <h4 className="font-medium mb-3">Dịch vụ</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="freeship" 
              checked={searchParams.get("freeship") === "true"}
              onCheckedChange={(checked) => {
                const params = new URLSearchParams(searchParams.toString())
                if (checked) {
                  params.set("freeship", "true")
                } else {
                  params.delete("freeship")
                }
                router.push(`?${params.toString()}`)
              }}
            />
            <Label htmlFor="freeship" className="cursor-pointer">
              Miễn phí vận chuyển
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="cod" 
              checked={searchParams.get("cod") === "true"}
              onCheckedChange={(checked) => {
                const params = new URLSearchParams(searchParams.toString())
                if (checked) {
                  params.set("cod", "true")
                } else {
                  params.delete("cod")
                }
                router.push(`?${params.toString()}`)
              }}
            />
            <Label htmlFor="cod" className="cursor-pointer">
              Thanh toán khi nhận hàng
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
