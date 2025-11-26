"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface SearchFiltersProps {
  categories?: Array<{ id: string; name: string }>
}

export function SearchFilters({ categories = [] }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState<number>(
    searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0
  )
  const [maxPrice, setMaxPrice] = useState<number>(
    searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 10000000
  )
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('categoryId') || ''
  )
  const [minRating, setMinRating] = useState<number>(
    searchParams.get('minRating') ? Number(searchParams.get('minRating')) : 0
  )
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sortBy') || 'createdAt'
  )
  const [direction, setDirection] = useState<string>(
    searchParams.get('direction') || 'DESC'
  )

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (minPrice > 0) params.set('minPrice', String(minPrice))
    else params.delete('minPrice')
    
    if (maxPrice < 10000000) params.set('maxPrice', String(maxPrice))
    else params.delete('maxPrice')
    
    if (selectedCategory) params.set('categoryId', selectedCategory)
    else params.delete('categoryId')
    
    if (minRating > 0) params.set('minRating', String(minRating))
    else params.delete('minRating')
    
    params.set('sortBy', sortBy)
    params.set('direction', direction)
    params.set('page', '0') // Reset to first page when filters change
    
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    params.set('q', searchParams.get('q') || '')
    router.push(`/search?${params.toString()}`)
  }

  const hasActiveFilters = 
    minPrice > 0 || 
    maxPrice < 10000000 || 
    selectedCategory || 
    minRating > 0 ||
    sortBy !== 'createdAt' ||
    direction !== 'DESC'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bộ lọc tìm kiếm</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <Label>Danh mục</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Khoảng giá</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Từ"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
              min={0}
            />
            <Input
              type="number"
              placeholder="Đến"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 10000000)}
              min={0}
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Đánh giá tối thiểu</Label>
          <Select 
            value={String(minRating)} 
            onValueChange={(v) => setMinRating(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              <SelectItem value="1">1 sao trở lên</SelectItem>
              <SelectItem value="2">2 sao trở lên</SelectItem>
              <SelectItem value="3">3 sao trở lên</SelectItem>
              <SelectItem value="4">4 sao trở lên</SelectItem>
              <SelectItem value="5">5 sao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sắp xếp theo</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Mới nhất</SelectItem>
              <SelectItem value="price">Giá</SelectItem>
              <SelectItem value="rating">Đánh giá</SelectItem>
              <SelectItem value="sold">Bán chạy</SelectItem>
              <SelectItem value="name">Tên A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Direction */}
        {sortBy !== 'name' && (
          <div className="space-y-2">
            <Label>Thứ tự</Label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Giảm dần</SelectItem>
                <SelectItem value="ASC">Tăng dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={applyFilters} className="w-full">
          Áp dụng bộ lọc
        </Button>
      </CardContent>
    </Card>
  )
}

